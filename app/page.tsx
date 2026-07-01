import type { Metadata } from "next";
import InvitationLanding from "./InvitationLanding";

export const metadata: Metadata = {
  title: "You're invited — #TheOriakhiTakeover2026",
  description: "You are invited to the wedding of Gbadamosi Motunrayo & Thomson ORIAKHI.",
};

export default function Home() {
  return <InvitationLanding />;
}
