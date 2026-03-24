/*
 * 根路径：按域名分流 member（$1） / job（$39）
 */

import { getSiteEntry } from "@/siteEntry";
import MemberSiteHome from "./MemberSiteHome";
import JobSiteHome from "./JobSiteHome";

export default function Home() {
  return getSiteEntry() === "member" ? <MemberSiteHome /> : <JobSiteHome />;
}
