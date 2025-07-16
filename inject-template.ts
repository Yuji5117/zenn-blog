import fs from "fs";
import path from "path";
import inquirer from "inquirer";

async function main() {
  const args = process.argv.slice(2);
  const templateArg = args.find((arg) => arg.startsWith("--template="));

  if (!templateArg) {
    console.error("❌ --template={テンプレート名}を指定してください。");
    process.exit(1);
  }

  const templateName = templateArg.split("=")[1];
  const templatePath = path.join(__dirname, "templates", `${templateName}.md`);

  if (!fs.existsSync(templatePath)) {
    console.error(`❌ テンプレート ${templateName} が見つかりません。`);
    process.exit(1);
  }

  const articleDir = path.join(__dirname, "articles");
  const files = fs
    .readdirSync(articleDir)
    .filter((file) => file.endsWith(".md"));

  if (!files) {
    console.error(`❌ 記事が1件も見つかりません。`);
    process.exit(1);
  }

  const { selectedFile } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedFile",
      message: "テンプレートを適用する記事を選んでください：",
      choices: files,
    },
  ]);

  const targetPath = path.join(articleDir, selectedFile);

  const originalContent = await fs.promises.readFile(targetPath, "utf-8");
  const templateContent = await fs.promises.readFile(templatePath, "utf-8");

  const newContent = `${originalContent}\n${templateContent}`;

  fs.writeFileSync(targetPath, newContent);

  console.log(
    `✅ テンプレート ${templateName} を ${selectedFile} に適用しました！`
  );
}

main();
