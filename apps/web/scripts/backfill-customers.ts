import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { normalizePhone } from "../src/shared/lib/phone";

config({ path: ".env.local" });

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL manquante");
  const sql = neon(connectionString);

  const pending = await sql`
    SELECT id, order_number, customer_first_name, customer_last_name, customer_phone, customer_email
    FROM orders WHERE customer_id IS NULL ORDER BY created_at
  `;
  console.log(`${pending.length} commande(s) sans client`);

  let linked = 0;
  const skipped: string[] = [];
  for (const order of pending) {
    const phone = normalizePhone(order.customer_phone as string);
    if (!phone) {
      skipped.push(`${order.order_number} (téléphone invalide : ${order.customer_phone})`);
      continue;
    }
    const email = (order.customer_email as string | null)?.trim().toLowerCase() || null;
    const [customer] = await sql`
      INSERT INTO customers (phone, email, first_name, last_name)
      VALUES (${phone}, ${email}, ${order.customer_first_name}, ${order.customer_last_name})
      ON CONFLICT (phone) DO UPDATE SET email = COALESCE(customers.email, EXCLUDED.email), updated_at = now()
      RETURNING id
    `;
    await sql`UPDATE orders SET customer_id = ${customer.id} WHERE id = ${order.id}`;
    linked += 1;
  }

  await sql`
    UPDATE customers c SET
      orders_count = (SELECT count(*) FROM orders o WHERE o.customer_id = c.id AND o.status <> 'cancelled'),
      total_spent = COALESCE((SELECT sum(total) FROM orders o WHERE o.customer_id = c.id AND o.status = 'delivered'), 0),
      first_order_at = (SELECT min(created_at) FROM orders o WHERE o.customer_id = c.id AND o.status <> 'cancelled'),
      last_order_at = (SELECT max(created_at) FROM orders o WHERE o.customer_id = c.id AND o.status <> 'cancelled'),
      updated_at = now()
  `;

  const [{ count }] = await sql`SELECT count(*)::int AS count FROM customers`;
  console.log(`${linked} commande(s) rattachée(s), ${count} client(s) au total.`);
  if (skipped.length > 0) console.log(`Non rattachées :\n- ${skipped.join("\n- ")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
