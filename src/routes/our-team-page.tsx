import { useEffect } from "react";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative min-h-screen text-foreground" style={{ backgroundColor: "#443356" }}>
      <Nav />

      {/* Hero Image */}
      <section className="relative overflow-hidden px-8 pt-32 pb-0 md:px-14">
        <div className="bloom" />
        <div className="absolute inset-0 glow-warm opacity-30" />
        <div className="relative mx-auto max-w-[1200px]">
          <Reveal>
            <img
              src={CS}
              alt="Our Team"
              className="w-full h-auto object-cover rounded-sm"
            />
          </Reveal>
        </div>
      </section>

      {/* About */}
      <section className="section-ambient relative border-t border-border/40 px-8 py-24 md:px-14 md:py-40">
        <div className="relative mx-auto max-w-[800px] text-center">
          <Reveal>
            <p className="kicker">About</p>
            <div className="mt-10 space-y-6 text-[14px] leading-loose text-muted-foreground">
              <p>
                Urbscapes is a design studio based in Ahmedabad, India founded by Narendra Mangwani and Nidhi Parikh in year 2008. The studio works in the field of master planning, landscape, architecture & research & documentation. The name of the studio \u201curbscapes\u201d is a combination of \u201curban\u201d & \u201clandscape\u201d as we believe working in our cities through built environment is shaping its landscape.
              </p>
              <p>
                We believe that design has to be appropriate to the context, climate, and function & should be in harmony with the nature. We strive to strike a balance between the need of the projects & what the project can offer. Each project is important to us, as it gives an opportunity to question & find appropriate answers.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Team Heading */}
      <section className="section-ambient relative border-t border-border/40 px-8 pt-0 pb-24 md:px-14 md:pb-40">
        <div className="relative mx-auto max-w-[1200px]">
          <Reveal>
            <h2 className="text-center font-display text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.05] text-[color:var(--gold)]">
              Our Team
            </h2>
          </Reveal>
        </div>
      </section>

      {/* Principal Architects */}
      <section className="relative border-t border-border/40 px-8 py-0 md:px-14">
        <div className="relative mx-auto max-w-[1000px] space-y-24">
          {PRINCIPALS.map((person, i) => (
            <div key={person.name} className={`grid gap-12 items-center ${i % 2 === 0 ? "md:grid-cols-[1fr_1.5fr]" : "md:grid-cols-[1.5fr_1fr]"}`}>
              <Reveal delay={i * 100} className={i % 2 === 1 ? "md:order-2" : ""}>
                <div className="rounded-sm border border-border bg-card/30 overflow-hidden">
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

      {/* Team Grid */}
      <section className="section-ambient relative border-t border-border/40 px-8 py-24 md:px-14 md:py-40">
        <div className="bloom" />
        <div className="absolute inset-0 glow-warm opacity-30" />
        <div className="relative mx-auto max-w-[1200px]">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {TEAM_GRID.map((member, i) => (
              <Reveal key={member.name} delay={i * 80}>
                <div className="group border border-border rounded-sm overflow-hidden bg-card/20 transition-all duration-500 hover:border-[color:var(--gold)]">
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
      <footer className="border-t border-border/30 px-8 py-4 md:px-14">
        <div className="flex items-center justify-between">
          <p className="font-display text-xl tracking-[0.3em] text-[#C8A86E]">
            SAHAJ GALLERY
          </p>
          <img
            src={ndhLogo}
            alt="NDH House"
            className="h-12 w-auto opacity-80"
          />
        </div>
      </footer>
    </main>
  );
}

export default OurTeam;
