import { useEffect } from "react";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { usePortraitNoScroll } from "@/lib/portrait";
import { ndhLogo4K as ndhLogo, sahajTransparentLogo as sahajLogo } from "@/assets/assets";

const CS = "https://img.magnific.com/free-vector/coming-soon-text-abstract-sunrise-dark-background-with-motion-effect_157027-1073.jpg?semt=ais_hybrid&w=740&q=80";

const TEAM_GRID = [
  { name: "Nehal Rathod", role: "Artist", img: CS },
  { name: "Hetakshi Chauhan", role: "Artist", img: CS },
  { name: "Chintu Bhalani", role: "Artist", img: CS },
  { name: "Arya Jadav", role: "Artist", img: CS },
  { name: "Hansni Sharma", role: "Artist", img: CS },
  { name: "Priyanka Solanki", role: "Administration Executive", img: CS },
];

const PRINCIPALS = [
  {
    name: "Pooja Bhavsar \u2013 Creative Designer,",
    subtitle: "Senior Architect \u2013 NDH House",
    img: CS,
    bio: "Pooja Bhavsar is the Creative Designer and Co-Founder of Sahaj, where architecture becomes the foundation of artistic expression. Drawing from her architectural expertise, she envisions artworks that are thoughtfully composed, spatially balanced, and deeply rooted in craftsmanship. Every Sahaj creation begins with her design vision. She transforms traditional narratives into contemporary works of art, blending architectural principles with handcrafted techniques to create pieces that feel timeless and distinctive. Her approach emphasizes proportion, materiality, texture, and detail, ensuring that each artwork is not only visually captivating but also harmoniously integrated into architectural spaces. With a belief that art should be an extension of architecture rather than an addition to it, She leads the creative direction of Sahaj, where every piece reflects a seamless dialogue between design, culture, and craftsmanship.",
  },
  {
    name: "Navneet Savaliya \u2013 Co-Founder, Sahaj",
    subtitle: "Principal Architect \u2013 NDH House",
    img: CS,
    bio: "His vision of seamlessly integrating art with architecture forms the foundation of Sahaj\u2019s philosophy. With a deep understanding of spatial design, materials, and craftsmanship, he believes that art should be an integral part of architecture rather than a decorative addition. His architectural perspective guides Sahaj in creating artworks that complement spaces with purpose, character, and timeless appeal. Through his leadership, Sahaj has evolved into a platform where architecture inspires art, and every creation is thoughtfully designed to enrich the built environment. His commitment to design excellence and cultural storytelling continues to shape Sahaj\u2019s identity as a destination where art and architecture come together in perfect harmony.",
  },
  {
    name: "Kishan Patel \u2013 Managing Director, Sahaj",
    img: CS,
    bio: "Kishan Patel leads the day-to-day operations and strategic growth of Sahaj, ensuring that every aspect of the gallery reflects its commitment to excellence, craftsmanship, and client experience. As Managing Director, he oversees gallery operations, business development, and customer relationships, while fostering collaborations with architects, designers, artists, and collectors. With a strong focus on quality, innovation, and service, He plays a vital role in transforming Sahaj\u2019s creative vision into a seamless experience from concept to installation. His leadership ensures that every artwork embodies Sahaj\u2019s philosophy of bringing art and architecture together, while delivering exceptional value to clients and design professionals alike.",
  },
];

function OurTeam() {
  usePortraitNoScroll();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative min-h-screen text-foreground" style={{ backgroundColor: "#443356" }}>
      <Nav />

      {/* About */}
      <section className="section-ambient relative px-8 py-24 md:px-14 md:py-40">
        <div className="relative mx-auto max-w-[800px] text-center">
          <Reveal>
            <p className="kicker">About</p>
            <div className="mt-10 space-y-6 text-[14px] leading-loose text-muted-foreground">
              <p>
                At Sahaj Gallery, we believe that art is more than an object it is an experience that transforms spaces and enriches everyday living. Born from the design philosophy of NDH House, Sahaj brings together artists, architects, designers, and skilled craftsmen to create artworks that seamlessly integrate with architecture and interiors.
              </p>
              <p>
                Our team is united by a shared commitment to craftsmanship, storytelling, and timeless design. Every creation is thoughtfully conceived, handcrafted with precision, and inspired by India's rich cultural heritage while embracing contemporary aesthetics.
              </p>
              <p>
                Together, we curate experiences that celebrate authenticity, collaboration, and creativity. From concept to installation, every member of the Sahaj team contributes to ensuring that each artwork carries meaning, purpose, and lasting value.
              </p>

              <p>
                We don't simply create art we craft stories that become a part of the spaces people live, work, and connect in.
              </p>
            </div>
          </Reveal>
        </div>
      </section >

      <div className="border-t border-[rgba(255,255,255,0.06)]" />

      {/* Team Heading */}
      <section className="section-ambient relative px-8 pt-24 pb-12 md:px-14 md:pt-40 md:pb-16">
        <div className="relative mx-auto max-w-[1200px]">
          <Reveal>
            <h2 className="text-center font-display text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.05] text-[color:var(--gold)]">
              Our Team
            </h2>
          </Reveal>
        </div>
      </section>

      {/* Principal Architects */}
      <section className="relative px-8 pt-12 md:px-14 md:pt-16">
        <div className="relative mx-auto max-w-[1000px] space-y-24">
          {PRINCIPALS.map((person, i) => (
            <div key={person.name} className={`grid gap-12 items-center ${i % 2 === 0 ? "md:grid-cols-[1fr_1.5fr]" : "md:grid-cols-[1.5fr_1fr]"}`}>
              <Reveal delay={i * 100} className={i % 2 === 1 ? "md:order-2" : ""}>
                <div className="rounded-sm border border-border overflow-hidden">
                  <img
                    src={person.img}
                    alt={person.name}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </Reveal>
              <Reveal delay={i * 100 + 150}>
                <div>
                  <h3 className="font-display text-xl text-[color:var(--gold)] leading-snug">
                    {person.name}
                  </h3>
                  {person.subtitle && (
                    <p className="mt-1 text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
                      {person.subtitle}
                    </p>
                  )}
                  <p className="mt-6 text-[14px] leading-relaxed text-muted-foreground">
                    {person.bio}
                  </p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-[rgba(255,255,255,0.06)]" />

      {/* Team Grid */}
      <section className="section-ambient relative px-8 py-24 md:px-14 md:py-40">
        <div className="relative mx-auto max-w-[1200px]">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {TEAM_GRID.map((member, i) => (
              <Reveal key={member.name} delay={i * 80}>
                <div className="group border border-border rounded-sm overflow-hidden transition-all duration-500 hover:border-[color:var(--gold)]">
                  <div className="overflow-hidden">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-[280px] md:h-[350px] object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h4 className="font-display text-sm text-foreground/90">
                      {member.name}
                    </h4>
                    <p className="mt-1 text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-[rgba(255,255,255,0.06)]" />
      <footer className="px-8 py-4 md:px-14">
        <div className="flex items-center justify-between">
          <p className="font-display text-lg md:text-xl tracking-[0.3em] text-[#C8A86E]">
            SAHAJ GALLERY
          </p>
          <img
            src={ndhLogo}
            alt="NDH House"
            className="h-12 w-auto opacity-80"
          />
        </div>
      </footer>
    </main >
  );
}

export default OurTeam;
