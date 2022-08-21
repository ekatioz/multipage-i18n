import cors from "cors";
import express from "express";
import { readdir, writeFile } from "fs/promises";
import { parse, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const app = express();
const port = 3000;
console.log(__dirname);

const namespacesPath = resolve(__dirname, "../locales/de");

app.use(cors());
app.use(express.json());

app.use("/locales", express.static(resolve(__dirname, "../locales")));

app.get("/namespaces", async (req, res) => {
  const namespaces = await readdir(namespacesPath);
  res.send(JSON.stringify(namespaces.map((name) => parse(name).name)));
});

app.put("/namespace/:namespace", async (req, res) => {
  const namespace = req.params.namespace;
  const translations = req.body;
  if (!namespace || !translations) {
    res.status(400);
    res.send("Missing namespace or translations.");
    return;
  }
  try {
    await writeFile(
      resolve(__dirname, "../locales/de/", namespace + ".json"),
      JSON.stringify(translations, null, 2),
      { encoding: "utf-8" }
    );
    res.status(200).send("OK!");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`localization-management server listening on port ${port}`);
});
