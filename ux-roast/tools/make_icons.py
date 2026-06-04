#!/usr/bin/env python3
"""Generate UX Roast extension icons (no third-party deps).

Draws a rounded-square badge with a soft indigo->violet gradient and a white
magnifying-glass mark, using 3x supersampled signed-distance fields for clean
anti-aliased edges. Outputs PNGs at the sizes the manifest references.
"""
import math
import os
import struct
import zlib

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "icons")

# Brand palette (Linear-ish indigo -> violet).
TOP = (99, 102, 241)      # indigo-500
BOTTOM = (139, 92, 246)   # violet-500
INK = (255, 255, 255)


def lerp(a, b, t):
    return a + (b - a) * t


def mix(c1, c2, t):
    return tuple(lerp(c1[i], c2[i], t) for i in range(3))


def clamp01(x):
    return max(0.0, min(1.0, x))


def rounded_rect_sdf(px, py, w, h, r):
    """Signed distance to a rounded rectangle centered at origin."""
    qx = abs(px) - (w / 2 - r)
    qy = abs(py) - (h / 2 - r)
    ax = max(qx, 0.0)
    ay = max(qy, 0.0)
    return math.hypot(ax, ay) + min(max(qx, qy), 0.0) - r


def ring_sdf(px, py, cx, cy, radius, thickness):
    d = math.hypot(px - cx, py - cy) - radius
    return abs(d) - thickness / 2


def segment_sdf(px, py, ax, ay, bx, by, thickness):
    vx, vy = bx - ax, by - ay
    wx, wy = px - ax, py - ay
    t = clamp01((wx * vx + wy * vy) / (vx * vx + vy * vy))
    dx = wx - vx * t
    dy = wy - vy * t
    return math.hypot(dx, dy) - thickness / 2


def render(size):
    ss = 3  # supersample factor
    n = size * ss
    half = n / 2
    pix = bytearray(size * size * 4)

    # Geometry in supersampled space.
    pad = n * 0.06
    side = n - 2 * pad
    corner = n * 0.24

    # Magnifying glass geometry.
    lens_cx = -n * 0.07
    lens_cy = -n * 0.07
    lens_r = n * 0.20
    lens_th = max(n * 0.075, 2.0)
    handle_th = lens_th
    hx0 = lens_cx + lens_r * 0.62
    hy0 = lens_cy + lens_r * 0.62
    hx1 = n * 0.26
    hy1 = n * 0.26

    for y in range(size):
        for x in range(size):
            r = g = b = a = 0.0
            for sy in range(ss):
                for sx in range(ss):
                    fx = (x * ss + sx + 0.5) - half
                    fy = (y * ss + sy + 0.5) - half

                    badge = rounded_rect_sdf(fx, fy, side, side, corner)
                    badge_a = clamp01(0.5 - badge)
                    if badge_a <= 0:
                        continue

                    t = clamp01(((fy + half) / n))
                    col = mix(TOP, BOTTOM, t)

                    # Magnifying glass mark in white.
                    ring = ring_sdf(fx, fy, lens_cx, lens_cy, lens_r, lens_th)
                    handle = segment_sdf(fx, fy, hx0, hy0, hx1, hy1, handle_th)
                    mark = min(ring, handle)
                    mark_a = clamp01(0.5 - mark)
                    col = mix(col, INK, mark_a)

                    r += col[0] * badge_a
                    g += col[1] * badge_a
                    b += col[2] * badge_a
                    a += badge_a

            cnt = ss * ss
            idx = (y * size + x) * 4
            if a > 0:
                pix[idx + 0] = int(r / cnt + 0.5)
                pix[idx + 1] = int(g / cnt + 0.5)
                pix[idx + 2] = int(b / cnt + 0.5)
                pix[idx + 3] = int(a / cnt * 255 + 0.5)
            else:
                pix[idx + 0] = pix[idx + 1] = pix[idx + 2] = pix[idx + 3] = 0
    return bytes(pix)


def write_png(path, size, rgba):
    def chunk(tag, data):
        c = tag + data
        return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)

    raw = bytearray()
    stride = size * 4
    for y in range(size):
        raw.append(0)  # no filter
        raw.extend(rgba[y * stride:(y + 1) * stride])

    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    idat = zlib.compress(bytes(raw), 9)
    with open(path, "wb") as f:
        f.write(sig)
        f.write(chunk(b"IHDR", ihdr))
        f.write(chunk(b"IDAT", idat))
        f.write(chunk(b"IEND", b""))


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for size in (16, 32, 48, 128):
        rgba = render(size)
        write_png(os.path.join(OUT_DIR, f"icon-{size}.png"), size, rgba)
        print(f"wrote icon-{size}.png")


if __name__ == "__main__":
    main()
