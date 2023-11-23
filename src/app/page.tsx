import Visual from "@/components/Art/visual";
import { redirect } from "next/navigation";

import { Navigator } from "@/components/Global/Navigator";
import { GetServerSideProps } from "next";

export default async function Page() {
  redirect("/conversation");
}
