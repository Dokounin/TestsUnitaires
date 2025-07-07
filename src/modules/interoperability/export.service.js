import xlsx from "node-xlsx";
import fs from "fs";
import path from "path";
import { getTransfersFromRepository } from "../banking/transfer/transfer.repository.js";
import { HttpBadRequest } from "@httpx/exception";

export async function createExport(accountId) {
  if (!accountId) {
    throw new HttpBadRequest("accountId est requis pour l'export.");
  }

  const transfers = await getTransfersFromRepository(accountId);

  const data = [
    ["ID", "Source", "Destination", "Montant"],
    ...transfers.map(t => [t.id, t.sourceAccountId, t.destAccountId, t.amount]),
  ];

  const buffer = xlsx.build([{ name: "Transferts", data }]);
  const exportPath = path.resolve("exports", `transfers_${accountId}.xlsx`);
  fs.writeFileSync(exportPath, buffer);

  return exportPath;
}
