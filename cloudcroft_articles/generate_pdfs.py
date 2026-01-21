#!/usr/bin/env python3
"""Generate PDFs for Cloudcroft Reader articles using reportlab."""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import os

# Ensure output directory exists
os.makedirs('/home/user/Claude-code/cloudcroft_articles', exist_ok=True)

# Create custom styles
styles = getSampleStyleSheet()
title_style = ParagraphStyle(
    'CustomTitle',
    parent=styles['Heading1'],
    fontSize=20,
    spaceAfter=12,
    alignment=TA_CENTER,
    textColor='#1a1a1a'
)
meta_style = ParagraphStyle(
    'Meta',
    parent=styles['Normal'],
    fontSize=10,
    textColor='#666666',
    alignment=TA_CENTER,
    spaceAfter=20,
    fontName='Helvetica-Oblique'
)
heading_style = ParagraphStyle(
    'CustomHeading',
    parent=styles['Heading2'],
    fontSize=14,
    spaceBefore=15,
    spaceAfter=8,
    textColor='#333333'
)
body_style = ParagraphStyle(
    'CustomBody',
    parent=styles['Normal'],
    fontSize=11,
    leading=16,
    spaceAfter=10,
    alignment=TA_LEFT
)
source_style = ParagraphStyle(
    'Source',
    parent=styles['Normal'],
    fontSize=9,
    textColor='#0000aa',
    fontName='Helvetica-Oblique',
    spaceBefore=30
)
header_style = ParagraphStyle(
    'Header',
    parent=styles['Normal'],
    fontSize=10,
    textColor='#888888',
    alignment=TA_CENTER,
    spaceAfter=20
)


def create_pdf(filename, title, author, date, content_paragraphs, source_url):
    """Create a PDF with the given content."""
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )

    story = []

    # Header
    story.append(Paragraph("Cloudcroft Reader", header_style))
    story.append(Spacer(1, 10))

    # Title
    story.append(Paragraph(title, title_style))

    # Meta info
    story.append(Paragraph(f"By {author} | {date}", meta_style))

    # Content
    for para in content_paragraphs:
        if para.startswith("##"):
            # It's a heading
            story.append(Paragraph(para[2:].strip(), heading_style))
        else:
            story.append(Paragraph(para, body_style))

    # Source
    story.append(Paragraph(f"Source: {source_url}", source_style))

    doc.build(story)
    print(f"Created: {os.path.basename(filename)}")


# Article 1: Trustee Who?
create_pdf(
    '/home/user/Claude-code/cloudcroft_articles/01_trustee_who.pdf',
    'Trustee Who?',
    'Reader Staff',
    'September 5, 2025',
    [
        "Following the resignation of former Trustee Tabitha Foster, a fourth Village of Cloudcroft (VoC) Trustee seat is now open for mayoral nomination and council appointment by majority vote of the remaining three trustees.",
        "The vacancy comes at a challenging time for Cloudcroft's village government, which has experienced significant turnover in recent years. Cloudcroft has had three mayors in the last 13 months, and the last two years have seen five different village clerks.",
        "The open trustee position adds another layer of uncertainty to a village administration already working to rebuild institutional knowledge and establish continuity in governance.",
        "The appointment process requires the mayor to nominate a candidate, who must then receive approval from a majority of the remaining trustees. Community members interested in serving on the board will need to express their interest and qualifications to village leadership.",
        "As Cloudcroft continues to navigate its transformation, the constant turnover has led to a loss of institutional knowledge and continuity, causing significant concerns among village community members about the stability of local government."
    ],
    'https://www.cloudcroftreader.com/p/trustee-who'
)


# Article 2: Meet Your Next Mayor
create_pdf(
    '/home/user/Claude-code/cloudcroft_articles/02_meet_your_next_mayor.pdf',
    'Meet Your Next Mayor: Video',
    'Cloudcroft Reader',
    'August 31, 2025',
    [
        "The day after candidate filing, Tim King and Gerald \"Dusty\" Wiley sat down with the Leadership Cloudcroft cohort for a side-by-side conversation about who would be the best mayor for the Village.",
        "This year, two candidates are on the ballot: Current Mayor Timothy King and the last mayoral election runner-up, Gerald \"Dusty\" Wiley.",
        "The first day after filing for office, the candidates faced off in front of the Leadership Cloudcroft group gathered at The Distillery.",
        "Wiley and King started with a healthy dose of friendly competition: Rock, Paper, Scissors, to see who would go first - Wiley won.",
        "The full conversation features the mayoral hopefuls conversing with the Reader, Leadership Cloudcroft cohort, current council and department heads, the Council of Governments folks, and more.",
        "## Topics Discussed",
        "The discussion covered key topics including vision for Cloudcroft's future, managing village finances and budget challenges, addressing staff turnover and retention, infrastructure priorities, and community engagement and transparency.",
        "Additional video episodes from Meet the Candidates: Leadership Cloudcroft are planned, featuring candidates for trustee, school board, and judge.",
        "This event was sponsored by the Cloudcroft Reader in partnership with Leadership Cloudcroft to provide voters with direct access to candidate perspectives ahead of the election."
    ],
    'https://www.cloudcroftreader.com/p/meet-your-next-mayor-video'
)


# Article 3: Fight for Us. Be Fair
create_pdf(
    '/home/user/Claude-code/cloudcroft_articles/03_fight_for_us_be_fair.pdf',
    'Fight for Us. Be Fair',
    'Reader Staff',
    'August 24, 2025',
    [
        "This article provides updates on police hiring developments and coverage of recent council meetings in Cloudcroft village government.",
        "## Police Hiring Update",
        "The Cloudcroft Reader asked questions about staff turnover and the hiring process, specifically inquiring about whether council members met or interviewed candidates for police positions.",
        "Trustee Maynard and Trustee Foster both stated they did not interview the candidates directly.",
        "The interview panel that was set up included: Mr. Mondragon (an ex-chief of police), Darren Hooker (a Counselor from Ruidoso who is also an ex-chief of police), Robin Cook from the high school or elementary school, and Officer Mitchell from the Otero County Sheriff's Office.",
        "This group interviewed both the current chief and one of the candidates, and unanimously suggested the police chief be hired.",
        "## Council Meeting Coverage",
        "The article also covers developments from recent council meetings, addressing ongoing challenges in village administration including staff retention and competitive wages, budget management with limited resources, and transparency in hiring and decision-making processes.",
        "The title \"Fight for Us. Be Fair\" reflects community sentiment about the need for equitable treatment and strong advocacy from village leadership during a period of significant transition."
    ],
    'https://www.cloudcroftreader.com/p/fight-for-us-be-fair'
)


# Article 4: Budget on Deadline
create_pdf(
    '/home/user/Claude-code/cloudcroft_articles/04_budget_on_deadline.pdf',
    'Cloudcroft Passes Budget on Deadline Despite Financial Uncertainty',
    'Cloudcroft Reader',
    'August 5, 2025',
    [
        "Cloudcroft met its state budget deadline for the first time since 2023 Thursday night, but not before council members aired deep doubts about spending decisions made just two days earlier in front of a packed audience.",
        "The contrast was stark: Where dozens of residents had crowded Tuesday's meeting to watch heated debates over staff raises, Thursday's budget approval drew only the fire chief, finance director, and two reporters to the village council chambers.",
        "## Budget Details",
        "The $1.7 million budget passed on a 3-0 vote, but the sparse attendance masked continuing divisions over how Cloudcroft should manage its finances while working with unreliable financial records dating back to 2022.",
        "Despite the one-topic agenda, there was interesting back-and-forth between Council members, which revealed the strains of trying to manage the tight village budget when recent financial reporting cannot be relied upon.",
        "## Key Challenges",
        "At the heart of Cloudcroft's budget challenges: Two-thirds of the village's operating funds go to personnel costs - police, maintenance, clerks. After years of staff turnover, officials are struggling to balance competitive wages against limited revenue and incomplete financial data.",
        "## Staff Raises Discussion",
        "There was discussion about delaying proposed employee raises. Trustee Nick Hanna pointed out that with Alamogordo only 16 miles away and with much higher wages for lateral employment, a commute for Cloudcroft residents is no feat.",
        "Trustee Jim Maynard noted that \"this budget, the surplus in the general fund revenue offsets the deficit in the water, wastewater sewer fund, pretty close.\"",
        "The budget passage represents a significant milestone for the village, which had missed previous deadlines, while highlighting ongoing financial management challenges."
    ],
    'https://www.cloudcroftreader.com/p/cloudcroft-passes-budget-on-deadline'
)


# Article 5: Police Force Expands
create_pdf(
    '/home/user/Claude-code/cloudcroft_articles/05_police_force_expands.pdf',
    "Cloudcroft's Police Force Expands with New Officer and Chief of Police",
    'Cloudcroft Reader',
    'July 9, 2025',
    [
        "Cloudcroft's police department has expanded with new hires aimed at strengthening public safety in the mountain community.",
        "## New Leadership",
        "Newly hired Chief of Police Rolando Hernandez, a Cloudcroft resident and retired Border Patrol agent, was appointed to lead the department.",
        "Mayor Tim King swore in both Hernandez and Officer Daniel Sepulveda at a special meeting on July 1, 2025.",
        "Daniel Sepulveda, who brought prior law enforcement experience from Hobbs and Eunice, was hired to serve as a new Peace Officer.",
        "## Background",
        "The hiring comes after a period of significant turnover in the police department that left Cloudcroft with limited law enforcement capacity. The village had been working to rebuild its police force after multiple resignations.",
        "## Subsequent Developments",
        "Note: In a later development, Mayor King announced the resignation of Police Chief Hernandez on September 15, 2025, who had only recently been appointed. In a pair of letters released by Mayor King, the Village of Cloudcroft bid farewell to Village Clerk Tabitha Foster and Police Chief Rolando J. Hernandez - both of whom resigned within days of each other.",
        "Their exits marked the latest in a series of high-profile resignations that reshaped the village's leadership.",
        "The constant turnover has led to concerns about institutional knowledge and continuity as Cloudcroft continues to navigate significant transitions in its village administration."
    ],
    'https://www.cloudcroftreader.com/p/cloudcrofts-police-force-expands'
)

print("\n" + "="*50)
print("All 5 PDFs have been generated successfully!")
print("Location: /home/user/Claude-code/cloudcroft_articles/")
print("="*50)
