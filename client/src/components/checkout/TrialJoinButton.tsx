import * as React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

type Props = React.ComponentProps<typeof Button>;

/**
 * member 站 Join 统一走站内入口：/price（不使用外部 checkout 链接）。
 */
export function TrialJoinButton({ children, ...props }: Props) {
  return (
    <Button {...props} asChild>
      <Link href="/price">{children}</Link>
    </Button>
  );
}
