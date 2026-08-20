#!/usr/bin/env python3
"""Generate investor-facing Morocco research PDF into public/research/."""

from __future__ import annotations

from pathlib import Path

from fpdf import FPDF

OUT = Path(__file__).resolve().parents[1] / "public" / "research" / "ECI-Morocco-Private-K12-Research-2026.pdf"

PURPLE = (45, 22, 84)
GOLD = (200, 168, 75)
MUTED = (90, 90, 100)
BODY = (40, 40, 48)


def ascii(text: str) -> str:
    """Core Helvetica is Latin-1; normalise punctuation for PDF output."""
    return (
        text.replace("\u2014", "-")
        .replace("\u2013", "-")
        .replace("\u2018", "'")
        .replace("\u2019", "'")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
        .replace("\u2026", "...")
        .replace("\u00a0", " ")
        .replace("≈", "~")
        .replace("–", "-")
        .replace("—", "-")
    )


class ReportPDF(FPDF):
    def header(self) -> None:
        if self.page_no() == 1:
            return
        self.set_font("Helvetica", "", 8)
        self.set_text_color(*MUTED)
        self.cell(0, 6, "Ellesmere College International  |  Morocco Private K-12 Research  |  March 2026", align="L")
        self.ln(8)

    def footer(self) -> None:
        self.set_y(-14)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(*MUTED)
        self.cell(0, 8, f"{self.page_no()}", align="C")

    def h1(self, text: str) -> None:
        self.set_font("Helvetica", "B", 16)
        self.set_text_color(*PURPLE)
        self.multi_cell(0, 8, ascii(text))
        self.ln(2)

    def h2(self, text: str) -> None:
        self.ln(2)
        self.set_font("Helvetica", "B", 12)
        self.set_text_color(*PURPLE)
        self.multi_cell(0, 7, ascii(text))
        self.ln(1)

    def body(self, text: str) -> None:
        self.set_font("Helvetica", "", 10)
        self.set_text_color(*BODY)
        self.multi_cell(0, 5.5, ascii(text))
        self.ln(1.5)

    def bullet(self, text: str) -> None:
        self.set_font("Helvetica", "", 10)
        self.set_text_color(*BODY)
        x = self.get_x()
        self.cell(5, 5.5, "-")
        self.multi_cell(0, 5.5, ascii(text))
        self.set_x(x)
        self.ln(0.5)


def build() -> Path:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    pdf = ReportPDF(format="A4")
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.add_page()

    # Cover
    pdf.set_fill_color(*PURPLE)
    pdf.rect(0, 0, 210, 297, "F")
    pdf.set_xy(20, 55)
    pdf.set_font("Helvetica", "", 11)
    pdf.set_text_color(*GOLD)
    pdf.cell(0, 8, "INVESTOR RESEARCH  |  VERSION 2.0  |  MARCH 2026")
    pdf.ln(16)
    pdf.set_x(20)
    pdf.set_font("Helvetica", "B", 28)
    pdf.set_text_color(255, 255, 255)
    pdf.multi_cell(170, 12, "Private K-12 Education in Morocco")
    pdf.ln(4)
    pdf.set_x(20)
    pdf.set_font("Helvetica", "", 13)
    pdf.set_text_color(230, 230, 235)
    pdf.multi_cell(170, 7, "Market overview & opportunity analysis for brand-licensing partners")
    pdf.ln(20)
    pdf.set_x(20)
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(*GOLD)
    pdf.multi_cell(170, 6, "Ellesmere College International")
    pdf.set_x(20)
    pdf.set_text_color(200, 200, 210)
    pdf.multi_cell(
        170,
        5.5,
        "Refreshed from ECI internal Draft 1.2 (July 2025) with 2025-26 enrolment, fee, competition, and regulatory updates.",
    )

    # Body pages
    pdf.add_page()
    pdf.h1("Executive summary")
    pdf.body(
        "Morocco presents a high-potential growth market for partners building under the Ellesmere brand. "
        "The private K-12 sector is large and urban, less mature than the Gulf, and shaped by rising demand for "
        "English-medium and British pathways among upper-middle families."
    )
    pdf.body(
        "About 1.27 million students attend private schools in 2025-26 (roughly 15% of national enrolment). "
        "Published international tuition in Casablanca typically clusters around a mid-60s MAD thousand median. "
        "American and IB premiums sit well above; French mission schools remain the value benchmark."
    )
    pdf.body(
        "British provision has expanded in Greater Casablanca, Rabat, and Tangier. The opportunity is "
        "differentiation on UK heritage brand, pastoral quality, and a clear MAD 60,000-90,000 mid-premium "
        "position — not an empty market. Priority locations: Rabat, Bouskoura / Casablanca suburbs, and Tangier."
    )

    pdf.h2("Key takeaways")
    for t in [
        "1.27M private students nationally in 2025-26; demand concentrated in the Casablanca-Rabat corridor.",
        "Mid-premium MAD 60-90k sits between French value and American/IB ultra-premium pricing.",
        "Compete on brand depth and quality assurance; BISC, London Academy, and Cambridge-linked schools are active.",
        "Law 59.21 raises fee transparency and annual contract standards — favourable for reputable operators.",
        "Primary partner model: brand licensing. Curriculum/advisory are optional add-ons.",
    ]:
        pdf.bullet(t)

    pdf.h2("Macro overview")
    pdf.body(
        "Population is approximately 38.4 million (2025), with a young age structure and urbanisation around "
        "two-thirds. Ministry figures for 2025-26 report 8.27 million enrolled students: about 7.00 million public "
        "and 1.27 million private. Private share has risen over the past decade, with schools heavily clustered "
        "along the Casablanca-Kenitra axis."
    )
    pdf.body(
        "Policy context includes the 2022-2026 education roadmap and Law 59.21, which requires written annual "
        "parent-school contracts, published fee lists (including ancillary services), and prohibits in-year fee "
        "increases. Foreign curricula may be offered subject to authorisation and national identity programme requirements."
    )

    pdf.h2("Tuition benchmarking")
    pdf.body(
        "Indicative annual tuition (published schedules / aggregators, 2025-26 and 2026-27). Confirm total cost locally."
    )
    for line in [
        "Value / French mission: approx. MAD 40,000-55,000 (e.g. Lycee Lyautey ~40.8k-48.2k).",
        "Accessible British / bilingual: approx. MAD 36,000-70,000 (e.g. London Academy Casa ~36k-69k).",
        "Mid-premium international (ECI alignment): MAD 60,000-90,000; Casa international median ~MAD 66.5k.",
        "Premium American / IB: approx. MAD 90,000-175,000+ (CAS, GWA published ranges).",
    ]:
        pdf.bullet(line)
    pdf.body(
        "A licensed Ellesmere school in the MAD 60-90k band targets families trading up for English pathways "
        "without paying ultra-premium American/IB fees."
    )

    pdf.h2("Competitive landscape")
    pdf.body(
        "French provision still dominates private international enrolment. English-medium and British pathways "
        "have grown materially. Partners should assume active competitors in Casablanca's orbit."
    )
    for line in [
        "Casablanca: French lycees; American/IB (CAS, GWA, American Academy); British options including BISC, London Academy (Bouskoura), and ISM.",
        "Rabat: fewer full British Nursery-Y13 campuses; American and French incumbents; London Academy also present.",
        "Tangier: Cambridge-linked options (e.g. Everest) and Anglo-Moroccan provision; lighter mid-fee British density than Casa-Rabat.",
        "Differentiation: UK independent-school heritage, pastoral/character education, network QA, transparent mid-premium pricing.",
    ]:
        pdf.bullet(line)

    pdf.h2("Priority destinations for partners")
    pdf.body(
        "Rabat — Very High: capital visibility, diplomatic/professional families, strong cultural fit for a UK-heritage flagship."
    )
    pdf.body(
        "Bouskoura & Greater Casablanca suburbs — Very High: affluent residential growth and deliverable sites. "
        "British competitors are present; win on brand depth and campus quality, not 'first British school' alone."
    )
    pdf.body(
        "Tangier — High: industrial and logistics-led professional growth; clear second-wave British heritage opportunity."
    )
    pdf.body(
        "Central Casablanca is selective (scale but saturation). Marrakesh, Agadir, Temara-Sale, Fes, and El Jadida "
        "suit later network phases or partnership-led entry."
    )

    pdf.h2("Location targeting snapshot")
    for row in [
        "Rabat: High scale | Strong income | Medium competition | Very High opportunity",
        "Bouskoura / Casa suburbs: Medium-High | Strong | Medium | Very High",
        "Tangier: Medium-High | Rising | Low-Medium | High",
        "Central Casablanca: Very High | Strong | High | Medium",
        "Marrakesh / Agadir: Medium | Moderate | Medium/Low | Moderate",
        "Temara-Sale: Medium | Moderate | Low | High (overflow)",
        "Fes / El Jadida: Medium-Low | Lower | Low | Watchlist",
    ]:
        pdf.bullet(row)

    pdf.h2("How partners engage")
    pdf.body(
        "ECI's primary offer is brand licensing: investors and operators build and run a school under the Ellesmere "
        "name, with curriculum frameworks, quality assurance, leadership support, and network governance. "
        "Curriculum and advisory services are optional add-ons — not parallel products."
    )
    for line in [
        "Capital and operating partners fund campus delivery and local operations.",
        "ECI licenses brand and standards; protects quality across the network.",
        "Plan Arabic / cultural programmes alongside British pathways.",
        "Fee transparency and annual parent contracts are baseline regulatory expectations.",
    ]:
        pdf.bullet(line)

    pdf.h2("Outlook")
    pdf.body(
        "Morocco combines demographic scale, urbanising affluence, and a private sector that already educates more "
        "than a million learners — yet English-medium mid-premium British provision remains thinner than in mature "
        "Gulf markets. For capital partners, Morocco is both a near-term campus opportunity and a long-term North "
        "African platform under a single licensed brand."
    )

    pdf.h2("Selected sources")
    for s in [
        "Ministry of National Education 2025-26 enrolment (reported via Morocco World News / Express TV).",
        "Law 59.21 private school transparency framework (SNRT / La Releve reporting).",
        "International Schools Database — Casablanca published fee schedules 2025/26-2026/27.",
        "doris — Casablanca international tuition medians (2026).",
        "men.gov.ma; hcp.ma.",
    ]:
        pdf.bullet(s)

    pdf.ln(4)
    pdf.set_font("Helvetica", "I", 8)
    pdf.set_text_color(*MUTED)
    pdf.multi_cell(
        0,
        4.5,
        "Disclaimer: For qualified investor and operator partners. Figures are compiled from public sources and may "
        "change; they are not a prospectus or fee quote. Confirm regulation, licensing, and school-level fees locally "
        "before investment decisions. Ellesmere College International.",
    )

    pdf.output(OUT)
    return OUT


if __name__ == "__main__":
    path = build()
    print(f"Wrote {path} ({path.stat().st_size} bytes)")
