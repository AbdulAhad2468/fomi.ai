"""Rebuild the two-page assessment handoff PDF with verified live links."""

from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader

ROOT = Path(__file__).parent
OUTPUT = ROOT / 'Fomi_Assessment_Submission.pdf'
LIVE = 'https://frame-studio-red.vercel.app'
REFERENCE = LIVE + '/reference'
GITHUB = 'https://github.com/AbdulAhad2468/fomi-frontend-assessment'

pdfmetrics.registerFont(TTFont('Segoe', r'C:\Windows\Fonts\segoeui.ttf'))
pdfmetrics.registerFont(TTFont('SegoeBold', r'C:\Windows\Fonts\segoeuib.ttf'))

W, H = A4
INK = HexColor('#191d18')
MUTED = HexColor('#626c60')
GREEN = HexColor('#bce685')
PAPER = HexColor('#fbfaf7')
LINE = HexColor('#dde2d8')

c = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
c.setTitle('Fomi - Frontend Engineering Assessment')
c.setAuthor('Abdul Ahad')

def text(x, y, value, size=10, bold=False, color=INK):
    c.setFillColor(color)
    c.setFont('SegoeBold' if bold else 'Segoe', size)
    c.drawString(x, y, value)

def paragraph(x, top, value, width, size=10, leading=15, color=INK, bold=False):
    style = ParagraphStyle('copy', fontName='SegoeBold' if bold else 'Segoe', fontSize=size,
                           leading=leading, textColor=color, spaceAfter=0)
    p = Paragraph(value, style)
    _, height = p.wrap(width, H)
    p.drawOn(c, x, top-height)
    return top-height

def link_row(x, y, label, url, width):
    c.setStrokeColor(LINE)
    c.line(x, y+17, x+width, y+17)
    text(x, y, label, 9, True, MUTED)
    text(x+118, y, url, 9, False, HexColor('#2e613c'))
    c.linkURL(url, (x, y-4, x+width, y+16), relative=0)

def cover_image(path, x, y, w, h):
    image = ImageReader(str(path))
    iw, ih = image.getSize()
    scale = max(w/iw, h/ih)
    dw, dh = iw*scale, ih*scale
    c.saveState()
    clip = c.beginPath()
    clip.roundRect(x, y, w, h, 12)
    c.clipPath(clip, stroke=0, fill=0)
    c.drawImage(image, x+(w-dw)/2, y+(h-dh)/2, width=dw, height=dh)
    c.restoreState()

def page_footer(page):
    c.setStrokeColor(LINE)
    c.line(42, 42, W-42, 42)
    text(42, 26, 'FOMI / FRONTEND ENGINEERING ASSESSMENT', 7.5, True, MUTED)
    text(W-62, 26, f'{page} / 2', 7.5, False, MUTED)

# Page 1: verified destinations and a compact project summary.
c.setFillColor(PAPER); c.rect(0, 0, W, H, stroke=0, fill=1)
c.setFillColor(INK); c.rect(0, H-89, W, 89, stroke=0, fill=1)
c.setFillColor(GREEN); c.roundRect(42, H-64, 28, 28, 7, stroke=0, fill=1)
text(51, H-57, 'f', 21, True, INK)
text(82, H-52, 'FOMI', 12, True, HexColor('#eaf3e2'))
text(W-178, H-52, 'FRONTEND ASSESSMENT', 8, True, GREEN)
text(42, H-135, 'Creative workspaces,', 27, True)
text(42, H-168, 'built for the work.', 27, True)
paragraph(42, H-186, 'A responsive mockup implementation and an original professional image workspace, built with Next.js and a mocked generation API.', W-84, 10, 16, MUTED)

cover_image(ROOT/'public/assets/ridge.png', 42, 375, 319, 192)
cover_image(ROOT/'public/assets/portrait-a.png', 371, 375, 182, 192)

text(42, 336, '01 / PART A', 9, True, HexColor('#8a6656'))
text(42, 316, 'Mockup implementation', 16, True)
paragraph(42, 306, 'A close responsive recreation of the supplied light generation page, including history, controls, results, detail views, and feedback states.', 480, 9.5, 14, MUTED)
text(42, 248, '02 / PART B', 9, True, HexColor('#587642'))
text(42, 228, 'The decision trail', 16, True)
paragraph(42, 218, 'An original workspace for returning creators: a large active frame, a focused composer, two-up comparison, and a record of the intent behind each output.', 480, 9.5, 14, MUTED)

link_row(42, 144, 'PART B / LIVE', LIVE, W-84)
link_row(42, 117, 'PART A / LIVE', REFERENCE, W-84)
link_row(42, 90, 'SOURCE CODE', GITHUB, W-84)
page_footer(1)
c.showPage()

# Page 2: product thinking answers, with one idea per block.
c.setFillColor(PAPER); c.rect(0, 0, W, H, stroke=0, fill=1)
text(42, H-55, 'PRODUCT THINKING', 9, True, HexColor('#587642'))
text(42, H-88, 'Designing for continuity', 24, True)
paragraph(42, H-100, 'Part B / Image Generation Workspace', W-84, 10, 14, MUTED)

sections = [
    ('1 / PROBLEM AND USER', 'A professional creator returning to an active campaign needs to remember why a direction worked and what changed between iterations. Most generation feeds keep the pixels but lose that context.'),
    ('2 / THREE UX DECISIONS', '<b>Keep the frame large:</b> judgment belongs at the center. <b>Bind context to output:</b> each result carries its prompt, direction, and frame. <b>Compare only two:</b> a pair supports a concrete decision without a crowded asset manager.'),
    ('3 / FEATURES LEFT OUT', 'I left out model marketplaces, social discovery, node graphs, and deep preset catalogs. They would distract from the core job: developing and evaluating a visual direction. The mock API is explicitly labeled as a demo.'),
    ('4 / INSPIRATION AND IMPROVEMENT', 'Krea informed the prompt-centered flow, Higgsfield the immersive review, and Magnific the visible professional controls. I added continuity: an earlier idea can be reopened with its intent and settings intact.'),
    ('5 / ANOTHER MONTH', 'I would connect real image and video services with progress, cancellation, and recovery; validate the decision trail with art directors; and add durable projects, team annotations, and stronger reference handling.'),
    ('6 / DIFFERENTIATING WORKFLOW', 'The decision trail turns history into an active creative tool. Selecting an output restores the thinking behind it as a starting point for the next exploration, rather than leaving it as another tile in a feed.'),
]
y = H-140
for label, body in sections:
    c.setStrokeColor(LINE); c.line(42, y+11, W-42, y+11)
    text(42, y-3, label, 8.5, True, HexColor('#557345'))
    y = paragraph(42, y-11, body, W-84, 9.25, 13.6, INK)-19

page_footer(2)
c.save()
print(OUTPUT)
