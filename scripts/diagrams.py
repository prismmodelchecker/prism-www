"""Diagrams for case studies, drawn as SVG in one style (that of the tutorial's die picture: pale yellow states,
dark outlines, black arrows). Usage: python3 scripts/diagrams.py, which (re)writes them all in src/images/cs/."""
import math

FILL, STROKE, TEXT = '#fff6bf', '#3b3b1f', '#1d1d27'
FONT = 'font-family="Helvetica, Arial, sans-serif"'


def head():
    return (f'<defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" '
            f'orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0 1 L10 5 L0 9 z" fill="{TEXT}"/></marker></defs>')


def pt(c, r, deg):
    return (c[0] + r * math.cos(math.radians(deg)), c[1] + r * math.sin(math.radians(deg)))


def line(p, q, both=False):
    return (f'<path d="M{p[0]:.1f} {p[1]:.1f} L{q[0]:.1f} {q[1]:.1f}" fill="none" stroke="{TEXT}" stroke-width="2" '
            f'marker-end="url(#a)"{" marker-start=\"url(#a)\"" if both else ""}/>')


def arc(p, q, ctrl, both=False):
    return (f'<path d="M{p[0]:.1f} {p[1]:.1f} Q{ctrl[0]:.1f} {ctrl[1]:.1f} {q[0]:.1f} {q[1]:.1f}" fill="none" stroke="{TEXT}" '
            f'stroke-width="2" marker-end="url(#a)"{" marker-start=\"url(#a)\"" if both else ""}/>')


def node(c, r, label, size=17):
    return (f'<circle cx="{c[0]}" cy="{c[1]}" r="{r}" fill="{FILL}" stroke="{STROKE}" stroke-width="2.5"/>'
            f'<text x="{c[0]}" y="{c[1]}" {FONT} font-size="{size}" text-anchor="middle" dominant-baseline="central" fill="{TEXT}">{label}</text>')


def svg(w, h, body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img">'
            f'<title>{title}</title>{head()}{body}</svg>\n')


def power_dtmc_sp():
    """Service provider of the DTMC power management model: five power states (power_dtmc_sp.pm)."""
    r, y = 40, 165
    xs = [60, 195, 330, 465, 600]
    names = ['active', 'idle', 'idlelp', 'stby', 'sleep']
    c = dict(zip(names, [(x, y) for x in xs]))
    gap = 3  # (arrows stop just short of the circles)
    parts = []
    # neighbours: active <-> idle, then idle -> idlelp -> stby -> sleep
    parts.append(line((c['active'][0] + r + gap, y), (c['idle'][0] - r - gap, y), both=True))
    for a, b in [('idle', 'idlelp'), ('idlelp', 'stby'), ('stby', 'sleep')]:
        parts.append(line((c[a][0] + r + gap, y), (c[b][0] - r - gap, y)))
    # over the top: active <-> idlelp, stby, sleep
    for b, h, sa, eb in [('idlelp', 55, -40, -125), ('stby', 100, -65, -115), ('sleep', 145, -90, -105)]:
        p, q = pt(c['active'], r + gap, sa), pt(c[b], r + gap, eb)
        parts.append(arc(p, q, ((p[0] + q[0]) / 2 + 10, y - r - h), both=True))
    # underneath: idle -> stby, idle -> sleep, idlelp -> sleep
    for a, b, h, sa, eb in [('idle', 'stby', 65, 55, 125), ('idlelp', 'sleep', 65, 55, 125), ('idle', 'sleep', 125, 95, 100)]:
        p, q = pt(c[a], r + gap, sa), pt(c[b], r + gap, eb)
        parts.append(arc(p, q, ((p[0] + q[0]) / 2, y + r + h)))
    parts += [node(c[n], r, n) for n in names]
    return svg(660, 320, ''.join(parts), 'Power states of the service provider: active, idle, idlelp, stby and sleep')





def between(a, b, r, gap=3):
    """Points on the edges of circles a and b (radius r), along the line between their centres."""
    dx, dy = b[0] - a[0], b[1] - a[1]
    d = math.hypot(dx, dy)
    ux, uy = dx / d, dy / d
    return (a[0] + ux * (r + gap), a[1] + uy * (r + gap)), (b[0] - ux * (r + gap), b[1] - uy * (r + gap))


def power_ctmc3_sp():
    """Service provider of the 3-state CTMC power management model, as in the case study's original figure."""
    r = 38
    c = {'busy': (60, 50), 'idle': (60, 185), 'sleep': (60, 320)}
    parts = [line(*between(c['busy'], c['idle'], r), both=True), line(*between(c['idle'], c['sleep'], r), both=True)]
    parts += [node(c[n], r, n) for n in c]
    return svg(120, 370, ''.join(parts), 'Power states of the service provider: busy, idle and sleep')


def power_ctmc4_sp():
    """Service provider of the 4-state CTMC power management model, as in the case study's original figure."""
    r = 40
    c = {'busy': (175, 50), 'idle': (175, 190), 'standby': (55, 300), 'sleep': (295, 300)}
    parts = [line(*between(c['idle'], c[n], r), both=True) for n in ('busy', 'standby', 'sleep')]
    parts += [node(c[n], r, n, 16 if n == 'standby' else 17) for n in c]
    return svg(350, 350, ''.join(parts), 'Power states of the service provider: busy, idle, standby and sleep')


def box(x, y, w, h, fill, stroke, rx=8):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="2"/>'


def label(x, y, lines, size=15, weight='600', anchor='middle'):
    out = ''
    for i, t in enumerate(lines):
        out += (f'<text x="{x}" y="{y + i * (size + 3)}" {FONT} font-size="{size}" font-weight="{weight}" text-anchor="{anchor}" '
                f'dominant-baseline="central" fill="{TEXT}">{t}</text>')
    return out


def power_system():
    """The power management system: request generator, service queue and service provider, observed and
    commanded by the power manager (the power case study's overview figure)."""
    parts = []
    # power manager
    parts.append(box(250, 15, 250, 50, '#dfe8fb', '#2f2ca8') + label(375, 40, ['Power Manager (PM)']))
    # the system it manages: queue and provider
    parts.append(box(175, 110, 425, 200, '#fbe6e2', '#9b2c1f', 10))
    # service queue: a queue with three slots, and its label
    parts.append(f'<path d="M205 190 H285 V220 H205" fill="none" stroke="{TEXT}" stroke-width="2"/>')
    for x in (250, 263, 276):
        parts.append(f'<line x1="{x}" y1="190" x2="{x}" y2="220" stroke="{TEXT}" stroke-width="2"/>')
    parts.append(label(245, 252, ['Service Queue', '(SRQ)'], 14))
    # service provider, with a small state diagram inside
    parts.append(box(345, 140, 230, 145, '#fff6bf', '#3b3b1f'))
    tri = [(460, 165), (425, 215), (495, 215)]
    for a, b in [(0, 1), (1, 2), (2, 0)]:
        parts.append(line(*between(tri[a], tri[b], 7, 1)))
    for p in tri:
        parts.append(f'<circle cx="{p[0]}" cy="{p[1]}" r="7" fill="#fff" stroke="{STROKE}" stroke-width="2"/>')
    parts.append(label(460, 252, ['Service Provider', '(SP)'], 14))
    # request generator, outside, sending requests to the queue
    parts.append(f'<ellipse cx="80" cy="205" rx="68" ry="46" fill="#e6e4f8" stroke="#3a3480" stroke-width="2"/>')
    parts.append(label(80, 196, ['Request', 'Generator (SR)'], 14))
    parts.append(line((150, 205), (200, 205)))
    parts.append(line((290, 205), (340, 205)))
    # observations up to the PM, commands down from it
    parts.append(line((330, 108), (330, 70)) + label(320, 89, ['State observations'], 13, '500', 'end'))
    parts.append(line((420, 70), (420, 108)) + label(430, 89, ['Commands'], 13, '500', 'start'))
    return svg(615, 325, ''.join(parts), 'The power management system: a request generator, a service queue and a service provider, '
               'which the power manager observes and sends commands to')


ALL = {'power_dtmc_sp': power_dtmc_sp, 'power_ctmc3_sp': power_ctmc3_sp, 'power_ctmc4_sp': power_ctmc4_sp, 'power_system': power_system}

FILES = {'power_dtmc_sp': 'power_dtmc.sp.svg', 'power_ctmc3_sp': 'power_ctmc3.sp.svg', 'power_ctmc4_sp': 'power_ctmc4.sp.svg',
         'power_system': 'power.pm.svg'}

if __name__ == '__main__':
    import os
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'images', 'cs')
    for name, draw in ALL.items():
        open(os.path.join(out, FILES[name]), 'w').write(draw())
        print('wrote', FILES[name])
