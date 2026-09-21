import Image from "next/image";
import { PAYMENT_METHODS } from "@/shared/config/navigation";

export function PaymentMethods() {
  return (
    <div>
      <p className="m-0 text-[10px] uppercase tracking-[0.22em] text-[#5a5a5a]">Paiement sécurisé par mobile money</p>
      <ul className="m-0 mt-3 flex list-none flex-wrap justify-center gap-2 p-0">
        {PAYMENT_METHODS.map((method) => (
          <li
            key={method.name}
            className="relative h-9 w-14 overflow-hidden rounded-[3px] border border-[#dcdcd8]"
            style={{ background: method.bg }}
          >
            <Image
              src={method.logo}
              alt={method.name}
              fill
              sizes="56px"
              className={method.fit === "cover" ? "object-cover" : "object-contain"}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
