#!/usr/bin/env python3
"""
Renew the ECI Morocco market overview PDF.

Source: Draft 1.2, Neil Tomalin, 25 July 2025 (31 pp internal overview).
This script produces an investor-facing renewal that keeps the original structure
and updates only claims that are stale or overstated against public 2025–26 data.
"""

from __future__ import annotations

from pathlib import Path

from fpdf import FPDF

ROOT = Path(__file__).resolve().parents[1]
OUT_PATHS = [
    ROOT / "public" / "research" / "ECI-Morocco-Market-Overview-Renewed-2026.pdf",
    Path("/opt/cursor/artifacts/ECI-Morocco-Market-Overview-Renewed-2026.pdf"),
]

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

PURPLE = (45, 22, 84)
GOLD = (200, 168, 75)
MUTED = (100, 100, 110)
BODY = (35, 35, 42)


class PDF(FPDF):
    def __init__(self) -> None:
        super().__init__(format="A4", unit="mm")
        self.set_auto_page_break(auto=True, margin=20)
        self.add_font("DejaVu", "", FONT)
        self.add_font("DejaVu", "B", FONT_B)

    def header(self) -> None:
        if self.page_no() == 1:
            return
        self.set_font("DejaVu", "", 8)
        self.set_text_color(*MUTED)
        self.cell(0, 5, "Ellesmere College International  ·  Morocco Market Overview (Renewed)  ·  March 2026")
        self.ln(7)
        self.set_draw_color(*GOLD)
        self.set_line_width(0.3)
        self.line(20, self.get_y(), 190, self.get_y())
        self.ln(4)

    def footer(self) -> None:
        self.set_y(-15)
        self.set_font("DejaVu", "", 8)
        self.set_text_color(*MUTED)
        self.cell(0, 8, str(self.page_no()), align="C")

    def cover(self) -> None:
        self.add_page()
        self.set_fill_color(*PURPLE)
        self.rect(0, 0, 210, 297, "F")
        self.set_xy(22, 48)
        self.set_font("DejaVu", "", 10)
        self.set_text_color(*GOLD)
        self.multi_cell(166, 6, "INVESTOR BRIEFING  ·  RENEWED FROM DRAFT 1.2 (25 JULY 2025)")
        self.ln(10)
        self.set_x(22)
        self.set_font("DejaVu", "B", 26)
        self.set_text_color(255, 255, 255)
        self.multi_cell(166, 12, "Private K–12 Education in Morocco")
        self.ln(4)
        self.set_x(22)
        self.set_font("DejaVu", "", 14)
        self.set_text_color(230, 225, 240)
        self.multi_cell(166, 8, "Market Overview & Opportunity Analysis")
        self.ln(8)
        self.set_x(22)
        self.set_font("DejaVu", "", 11)
        self.set_text_color(*GOLD)
        self.multi_cell(166, 6, "Ellesmere College International")
        self.ln(4)
        self.set_x(22)
        self.set_font("DejaVu", "", 10)
        self.set_text_color(200, 195, 210)
        self.multi_cell(
            166,
            5.5,
            "Version 2.0 — March 2026\n"
            "Renewal of Neil Tomalin, Draft 1.2 (25 July 2025).\n"
            "Investor / brand-licensing audience. Facts checked against public 2025–26 sources.",
        )
        self.set_xy(22, 250)
        self.set_font("DejaVu", "", 8)
        self.set_text_color(170, 165, 180)
        self.multi_cell(
            166,
            4.5,
            "What changed in this renewal: national enrolment (2025–26 Ministry figures); "
            "tuition benchmarks from published 2025/26–2026/27 schedules; British competition "
            "wording where the original overstated white space; Law 59.21 fee/contract rules; "
            "tone shifted from internal board instructions to partner opportunity language.",
        )

    def h1(self, text: str) -> None:
        self.ln(2)
        self.set_font("DejaVu", "B", 15)
        self.set_text_color(*PURPLE)
        self.multi_cell(0, 7.5, text)
        self.ln(2)

    def h2(self, text: str) -> None:
        self.ln(2)
        self.set_font("DejaVu", "B", 11.5)
        self.set_text_color(*PURPLE)
        self.multi_cell(0, 6.5, text)
        self.ln(1)

    def h3(self, text: str) -> None:
        self.ln(1)
        self.set_font("DejaVu", "B", 10)
        self.set_text_color(76, 37, 133)
        self.multi_cell(0, 5.5, text)
        self.ln(0.5)

    def p(self, text: str) -> None:
        self.set_font("DejaVu", "", 9.5)
        self.set_text_color(*BODY)
        self.multi_cell(0, 5.2, text)
        self.ln(1.5)

    def bullets(self, items: list[str]) -> None:
        self.set_font("DejaVu", "", 9.5)
        self.set_text_color(*BODY)
        for item in items:
            x = self.l_margin
            self.set_x(x)
            self.cell(4, 5.2, "•")
            self.multi_cell(0, 5.2, item)
            self.ln(0.4)
        self.ln(1)

    def note(self, text: str) -> None:
        self.set_font("DejaVu", "", 8)
        self.set_text_color(*MUTED)
        self.multi_cell(0, 4.5, text)
        self.ln(2)

    def table(self, headers: list[str], rows: list[list[str]], col_w: list[float]) -> None:
        self.set_font("DejaVu", "B", 8)
        self.set_text_color(*PURPLE)
        for h, w in zip(headers, col_w):
            self.cell(w, 6, h, border=0)
        self.ln(6)
        self.set_draw_color(220, 220, 225)
        self.line(self.l_margin, self.get_y(), self.l_margin + sum(col_w), self.get_y())
        self.ln(1.5)
        self.set_font("DejaVu", "", 8)
        self.set_text_color(*BODY)
        for row in rows:
            # estimate height
            y0 = self.get_y()
            if y0 > 260:
                self.add_page()
                y0 = self.get_y()
            x0 = self.l_margin
            heights = []
            for cell, w in zip(row, col_w):
                # rough wrap count
                heights.append(5 + 4.5 * max(0, len(cell) // max(1, int(w / 1.7))))
            h = max(6.5, min(max(heights), 18))
            for cell, w in zip(row, col_w):
                self.set_xy(x0, y0)
                self.multi_cell(w, 4.2, cell)
                x0 += w
            self.set_y(y0 + h)
        self.ln(2)


def build() -> Path:
    pdf = PDF()
    pdf.set_margins(20, 18, 20)
    pdf.cover()

    # --- Executive summary ---
    pdf.add_page()
    pdf.h1("1. Executive summary")
    pdf.p(
        "Morocco remains a high-potential growth market for partners building under the Ellesmere "
        "brand. Fundamentals are intact: a large youth population, rising urban affluence, "
        "bilingualism, political stability, and national reforms that still emphasise quality and "
        "internationalisation. The private K–12 sector is less mature than the Gulf, but it is no "
        "longer a thin fringe market."
    )
    pdf.p(
        "What is new since Draft 1.2 (July 2025): Ministry figures for the 2025–26 school year put "
        "national enrolment at about 8.27 million students, of whom about 1.27 million (≈15%) "
        "attend private institutions. That replaces the report’s older ~8.0 million / ~1.1 million "
        "(2022/23) framing. British and English-medium provision has also thickened in Greater "
        "Casablanca and Rabat — so the commercial thesis is differentiation on heritage brand, "
        "pastoral quality and a clear mid-premium fee band, not an empty market."
    )
    pdf.p(
        "The mid-premium band of MAD 60,000–90,000 per year remains the right commercial "
        "alignment for an Ellesmere-licensed campus: above most French-mission and entry British "
        "offers, well below elite American / IB premiums. Casablanca international schools that "
        "publish fees still cluster around a mid-60s MAD thousand median."
    )
    pdf.h3("Partner priorities (unchanged ranking logic; refreshed competition wording)")
    pdf.bullets(
        [
            "Rabat — flagship visibility, diplomatic / professional demand, strong cultural fit.",
            "Bouskoura / Greater Casablanca suburbs — scale and deliverable sites; compete with existing British provision (BISC, London Academy), do not claim first-mover exclusivity.",
            "Tangier — industrial growth corridor; Cambridge-linked schools exist; mid-fee British heritage density still lighter than Casa–Rabat.",
            "Later: Marrakesh, Agadir, Témara–Salé overflow; Fès / El Jadida as watchlist or partnership-led plays.",
        ]
    )
    pdf.p(
        "Primary commercial model for readers of this briefing: brand licensing. Capital and "
        "operating partners build and run the school under the Ellesmere name; ECI provides "
        "curriculum frameworks, quality assurance, leadership support and network governance. "
        "Curriculum / advisory services are optional add-ons, not peer products."
    )

    # --- Matrix ---
    pdf.add_page()
    pdf.h1("2. Market targeting matrix")
    pdf.p(
        "Same dimensions as Draft 1.2: market scale, mid/upper-mid income base for MAD 60–90k "
        "fees, competition saturation, regulatory / investment support, and composite opportunity. "
        "Competition ratings for Bouskoura and Tangier are edged up versus Draft 1.2 to reflect "
        "active British / Cambridge provision."
    )
    pdf.table(
        ["Location", "Scale", "Income fit", "Competition", "Opportunity"],
        [
            ["Bouskoura (Casa suburbs)", "Med–High", "Strong", "Medium", "Very High"],
            ["Rabat", "High", "Strong", "Medium", "Very High"],
            ["Tangier", "Med–High", "Rising", "Low–Med", "High"],
            ["Central Casablanca", "Very High", "Strong", "High", "Medium"],
            ["Marrakesh", "Medium", "Moderate", "Medium", "Moderate"],
            ["Agadir", "Medium", "Moderate", "Low–Med", "Medium"],
            ["Témara / Salé", "Medium", "Moderate", "Low", "High (overflow)"],
            ["Fès / El Jadida", "Med–Low", "Lower", "Low", "Watchlist"],
        ],
        [48, 24, 28, 28, 42],
    )

    pdf.h2("Regional scorecard (1–5; higher is stronger — except competition = saturation)")
    pdf.table(
        ["Region", "Demand", "Income", "Fee fit", "Reg.", "Comp.", "UK curr.", "Culture", "Total"],
        [
            ["Rabat", "5", "5", "5", "5", "3", "4", "5", "32"],
            ["Central Casa", "5", "5", "4", "4", "4", "4", "4", "30"],
            ["Bouskoura", "4", "5", "5", "4", "3", "3", "5", "29"],
            ["Tangier", "4", "4", "4", "4", "2", "3", "5", "26"],
            ["Témara/Salé", "3", "4", "4", "4", "2", "2", "4", "23"],
            ["Marrakesh", "3", "3", "3", "4", "3", "2", "4", "22"],
            ["Agadir", "3", "3", "3", "4", "2", "2", "4", "21"],
            ["Fès/El Jadida", "2", "2", "2", "3", "1", "1", "3", "14"],
        ],
        [32, 16, 16, 16, 14, 16, 18, 18, 14],
    )
    pdf.note(
        "Score changes vs Draft 1.2: Bouskoura competitive saturation raised from 2→3; composite "
        "still Tier 1. Rabat remains the highest weighted score."
    )

    # --- Macro ---
    pdf.add_page()
    pdf.h1("3. Macro overview (updated)")
    pdf.h2("Demographics")
    pdf.p(
        "Morocco’s population is about 38.4 million (2025), with roughly a quarter under age 15 "
        "and urbanisation around two-thirds. Demand concentrates in Greater Casablanca, "
        "Rabat–Salé–Témara, Tangier, Marrakesh, Fès and Agadir. Education is compulsory through "
        "lower secondary; primary enrolment is near-universal."
    )
    pdf.h2("Public vs private enrolment — refreshed")
    pdf.p(
        "Draft 1.2 cited ≈8.0 million K–12 students (2022/23) with ≈1.1 million private (~14%). "
        "For 2025–26, the Minister of National Education reported 8,271,256 enrolled students: "
        "7,004,533 public (+3.4%) and 1,266,723 private. Private share is therefore about 15% of "
        "the national system — consistent with the longer-run rise from ~10% in the 2000s."
    )
    pdf.p(
        "The structural geography in Draft 1.2 still holds: private schools remain heavily "
        "clustered along the Casablanca–Kénitra corridor. Secondary cities are thinner but "
        "relevant for later network phases."
    )
    pdf.h2("Regulatory environment — refreshed")
    pdf.p(
        "The enabling stance toward private and international education continues, with tighter "
        "consumer-protection style oversight. Law 59.21 (school education code) requires written "
        "annual parent–school contracts, continuous publication of fee lists (registration, "
        "tuition, insurance, catering, transport), and prohibits in-year fee increases. Foreign "
        "curricula may be offered subject to authorisation; schools must still deliver programmes "
        "that respect national identity (including Arabic / Amazigh pathways)."
    )
    pdf.p(
        "There remains no general prohibition on foreign participation via local structures; "
        "Ministry authorisation and Moroccan content obligations still apply. Partners should "
        "treat fee transparency and annual contracting as design requirements, not afterthoughts."
    )
    pdf.h2("International & bilingual landscape")
    pdf.p(
        "French-medium provision still anchors much of the upper-middle market (AEFE / OSUI and "
        "mission schools; published Lyautey bands ≈ MAD 40.8k–48.2k for 2026/27). American / IB "
        "schools remain the price ceiling (e.g. Casablanca American School ≈ MAD 94k–163k; "
        "George Washington Academy ≈ MAD 99k–174k on published schedules)."
    )
    pdf.p(
        "British provision is no longer nascent. Active names include British International School "
        "of Casablanca (BISC), London Academy (Casablanca / Bouskoura and Rabat; published "
        "Casablanca tuition ≈ MAD 36k–69k for 2026/27), International School of Morocco (BSO / "
        "IB primary), plus Cambridge-linked options in Tangier (e.g. Everest) and longer-standing "
        "Anglo-Moroccan provision. Local groups (Elbilia, Holged / Yassamine–Al Jabr and others) "
        "continue to add English / international streams."
    )
    pdf.p(
        "Implication for Ellesmere partners: the MAD 60–90k “value premium” gap between French "
        "mission pricing and American / IB premiums is still real — but several British and "
        "hybrid operators already sit in or below that band. Win on brand depth, pastoral offer, "
        "network quality assurance and campus quality."
    )

    # --- Regional ---
    pdf.add_page()
    pdf.h1("4. Regional market analysis")
    pdf.p(
        "City narratives below follow Draft 1.2’s structure. Opportunity judgements are retained "
        "where still valid; competition wording is tightened where Draft 1.2 overstated white space."
    )

    pdf.h2("4.1 Casablanca (Greater Casablanca)")
    pdf.p(
        "Still Morocco’s deepest education market: largest metro economy, densest affluent "
        "catchment, most international schools. Premium American / IB and French incumbents "
        "operate near capacity in established districts. Central Casablanca remains high-scale "
        "but saturated and site-constrained — better as a catchment for a suburban campus than "
        "as a first greenfield city-centre build."
    )
    pdf.p(
        "Updated competition note: British options are established (BISC; London Academy in "
        "Bouskoura; ISM). Draft 1.2’s “gap in mid-premium British schools” should be read as "
        "room to differentiate a heritage UK independent brand with network QA — not absence of "
        "British supply."
    )

    pdf.h2("4.2 Rabat")
    pdf.p(
        "Still a Tier-1 partner priority. Diplomatic and professional families, strong fee "
        "capacity, high brand visibility, and cultural affinity with British education. Fewer "
        "full Nursery–Y13 British campuses than Casablanca, though London Academy also operates "
        "in Rabat and American / French incumbents are strong. Best framed as a flagship "
        "prestige + durability play for brand-licensing partners."
    )

    pdf.h2("4.3 Bouskoura & Casablanca growth corridors")
    pdf.p(
        "Draft 1.2 correctly identified Bouskoura and adjacent new zones as the practical "
        "Casablanca entry: affluent villa / gated-community growth, easier land assembly, "
        "developer partnership potential. That thesis stands."
    )
    pdf.p(
        "Renewal correction: do not describe Bouskoura as low-saturation British white space. "
        "BISC and London Academy already serve the corridor. Residential growth can still "
        "support additional mid-premium capacity, especially with a differentiated Ellesmere "
        "proposition and careful micro-location (including Zenata and other eastern / corridor "
        "nodes called out in Draft 1.2)."
    )

    pdf.h2("4.4 Tangier")
    pdf.p(
        "Port, free-zone and automotive investment continue to expand the professional class. "
        "Draft 1.2’s first-mover language should be softened: Cambridge-oriented and "
        "Anglo-Moroccan provision exists (including Everest’s Cambridge accreditation narrative "
        "and the longer-standing Anglo-Moroccan School). Mid-fee British heritage density remains "
        "lighter than Casa–Rabat, so Tangier stays a strong second-wave / northern network node."
    )

    pdf.h2("4.5 Marrakesh")
    pdf.p(
        "Still a medium, niche market: lifestyle / tourism / upper-local demand; American School "
        "of Marrakesh and other internationals present. Suitable as a later network phase rather "
        "than a volume flagship. Cultural expectations for Arabic / Islamic studies alongside "
        "British pathways remain relevant."
    )

    pdf.h2("4.6 Agadir")
    pdf.p(
        "Limited international stack beyond the French mission and thinner English options. "
        "Absolute demand is modest; white-space ratio is high. Keep as a southern regional node "
        "after a Moroccan flagship is proven."
    )

    pdf.h2("4.7 Fès & El Jadida")
    pdf.p(
        "Watchlist / partnership-led only. Fès has French and limited American provision; fee "
        "pools are thinner. El Jadida’s industrial corridor creates some professional demand, "
        "but scale may not support multiple mid-premium internationals — Draft 1.2’s caution "
        "still applies."
    )

    pdf.h2("4.8 Témara / Salé / Kénitra (Rabat periphery)")
    pdf.p(
        "Still a credible overflow thesis: residential spillover from Rabat, improving employment "
        "nodes (e.g. Kénitra industry / free zone). High accessibility opportunity if priced and "
        "positioned for upper-middle families who cannot or will not commute into central Rabat "
        "premium schools."
    )

    # --- Fees ---
    pdf.add_page()
    pdf.h1("5. Competitive landscape & tuition benchmarking (updated)")
    pdf.p(
        "Draft 1.2’s three-tier mental model still works. Numbers below refresh published "
        "schedules and aggregator medians for 2025/26–2026/27. Always verify total cost "
        "(registration, transport, meals, exams)."
    )
    pdf.h3("Value / French mission — ≈ MAD 40,000–55,000")
    pdf.p(
        "Lycée Lyautey published 2026/27 bands ≈ MAD 40,800–48,200. Remains the academically "
        "strong value benchmark for many Moroccan families."
    )
    pdf.h3("Accessible British / bilingual international — ≈ MAD 36,000–70,000")
    pdf.p(
        "London Academy Casablanca published ≈ MAD 36,000–69,000 (2026/27). École Belge de "
        "Casablanca ≈ MAD 47,060–68,580. Several hybrid / bilingual locals sit in or just below "
        "this range."
    )
    pdf.h3("Mid-premium international (Ellesmere alignment) — MAD 60,000–90,000")
    pdf.p(
        "Still the intended band. Casablanca international schools that publish fees show a "
        "median around MAD 66,500 (doris, 2026). BISC does not publish a public fee schedule in "
        "major aggregators; Draft 1.2’s parent-forum estimate of ~MAD 70–80k for early grades "
        "should be treated as indicative only until confirmed."
    )
    pdf.h3("Premium American / IB — ≈ MAD 90,000–175,000+")
    pdf.p(
        "Casablanca American School ≈ MAD 93,678–163,054 (2025/26 published). George Washington "
        "Academy ≈ MAD 99,450–173,700 (2026/27 published). American Academy Casablanca also "
        "publishes high bands. These remain the price ceiling Draft 1.2 described."
    )
    pdf.p(
        "Positioning conclusion (renewed): an Ellesmere-licensed school at MAD 60–90k still sits "
        "in the trade-up zone between French value and American / IB ultra-premium — but must "
        "expect active British and hybrid competitors inside or adjacent to that band, especially "
        "in Greater Casablanca."
    )

    # --- Conclusion ---
    pdf.h1("6. Outlook for brand-licensing partners")
    pdf.p(
        "Morocco offers both a near-term campus opportunity and a longer-term North African "
        "platform. Demographics, private-sector scale (≈1.27 million private students in "
        "2025–26), and policy openness remain favourable. The competitive field is more crowded "
        "in British / English pathways than Draft 1.2 sometimes implied — particularly around "
        "Casablanca’s southern suburbs."
    )
    pdf.p(
        "Priority partner locations remain Rabat, Bouskoura / Greater Casablanca suburbs, and "
        "Tangier. Success depends on local partnership, cultural fluency (Arabic / national "
        "programmes alongside British pathways), fee transparency under Law 59.21, and clear "
        "differentiation on Ellesmere’s heritage brand and pastoral model."
    )
    pdf.p(
        "Commercial model reminder: partners invest and operate; ECI licenses brand and "
        "standards. That is the product this briefing supports."
    )

    pdf.h1("7. Sources used for this renewal")
    pdf.bullets(
        [
            "Ministère de l’Éducation Nationale — 2025–26 enrolment as reported by Morocco World News / Express TV (Sept 2025): 8,271,256 total; 1,266,723 private; 7,004,533 public.",
            "Law 59.21 school education framework — fee transparency, annual contracts, ban on in-year increases (SNRT News / La Relève reporting).",
            "International Schools Database — Casablanca published fee schedules 2025/26–2026/27 (Lyautey, CAS, GWA, London Academy, Belgian School, etc.).",
            "doris — Casablanca international tuition median ≈ MAD 66,500 (2026).",
            "men.gov.ma; hcp.ma; AMDIE — structural / regulatory context retained from Draft 1.2 source list.",
            "Base document: Neil Tomalin, Private K–12 Education in Morocco — Market Overview & Opportunity Analysis, Draft 1.2, 25 July 2025.",
        ]
    )
    pdf.note(
        "Disclaimer: For qualified investor and operator partners. Figures are compiled from "
        "public sources and may change; they are not a prospectus or a school fee quote. Confirm "
        "regulation, licensing and school-level fees locally before investment decisions. "
        "Ellesmere College International — March 2026."
    )

    primary = OUT_PATHS[0]
    primary.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(primary)
    for dest in OUT_PATHS[1:]:
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(primary.read_bytes())
    return primary


if __name__ == "__main__":
    path = build()
    print(f"Wrote {path} ({path.stat().st_size} bytes)")
    for p in OUT_PATHS:
        print(f"  -> {p} exists={p.exists()} size={p.stat().st_size if p.exists() else 0}")
