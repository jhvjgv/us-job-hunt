import { useEffect } from "react";
import { getSiteEntry, getJobOrigin } from "@/siteEntry";

/**
 * /program：member 站跳转到 job 站；job 站合并到首页 Thinkific 布局，跳回 /
 */
export default function ProgramRedirect() {
  useEffect(() => {
    if (getSiteEntry() === "member") {
      window.location.replace(`${getJobOrigin()}/`);
      return;
    }
    window.location.replace("/");
  }, []);

  return (
    <div className="flex min-h-[40vh] items-center justify-center font-dm-sans text-sm text-muted-foreground">
      正在跳转…
    </div>
  );
}
