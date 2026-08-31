import { connectToDatabase } from "../../lib/mongodb.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.query.token !== process.env.CRON_SECRET_TOKEN) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { db } = await connectToDatabase();

    const missingUtc = await db
      .collection("appointments")
      .find({ appointment_datetime_utc: { $exists: false } })
      .toArray();

    let updated = 0;
    for (const appt of missingUtc) {
      const offset = Number(appt.timezone_offset) || 420;
      const local = new Date(`${appt.appointment_date}T${appt.appointment_time}:00`);
      const utc = new Date(local.getTime() + offset * 60 * 1000);

      await db
        .collection("appointments")
        .updateOne(
          { _id: appt._id },
          { $set: { appointment_datetime_utc: utc, timezone_offset: offset } }
        );
      updated++;
    }

    return res.status(200).json({ message: "Backfill complete", updated, total: missingUtc.length });
  } catch (error) {
    console.error("MIGRATION ERROR:", error);
    return res.status(500).json({ message: error.message || "Migration failed." });
  }
}
