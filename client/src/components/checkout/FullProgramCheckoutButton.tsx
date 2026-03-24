import * as React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { getFullProgramCheckoutUrl, isHttpUrl } from "@/checkout";

type Props = React.ComponentProps<typeof Button>;

/**
 * 站点二：$39 外部结账。未配置时链到 /pricing（支付宝等站内支付）。
 */
export function FullProgramCheckoutButton({ children, ...props }: Props) {
  const url = getFullProgramCheckoutUrl();
  if (url && isHttpUrl(url)) {
    return (
      <Button {...props} asChild>
        <a href={url} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      </Button>
    );
  }
  return (
    <Button {...props} asChild>
      <Link href="/pricing">{children}</Link>
    </Button>
  );
}
