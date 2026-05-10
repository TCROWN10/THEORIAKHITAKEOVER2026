import type { Metadata } from "next";
import InvitationLanding from "./InvitationLanding";

export const metadata: Metadata = {
  title: "You're invited — IDLoveStory",
  description: "You are invited to the wedding of Ibierebo & Damilola.",
};

export default function Home() {
  return <InvitationLanding />;
}
