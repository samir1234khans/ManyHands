const branch = process.argv[2];

if (!branch) {
  console.error(
    "usage: node scripts/validate-branch-name.mjs <branch-name>\n" +
      "example: node scripts/validate-branch-name.mjs feat/5-github-auth-profile",
  );
  process.exit(2);
}

if (branch === "main") {
  console.log("valid permanent branch: main");
  process.exit(0);
}

if (branch.startsWith("dependabot/") || branch.startsWith("renovate/")) {
  console.log(`valid automation branch: ${branch}`);
  process.exit(0);
}

const pattern =
  /^(feat|fix|docs|chore|security|research|design|test|refactor)\/([1-9]\d*)-([a-z0-9]+(?:-[a-z0-9]+)*)$/;
const match = pattern.exec(branch);

if (!match) {
  console.error(`invalid ManyHands branch name: ${branch}`);
  console.error(
    "expected <type>/<issue-number>-<lowercase-hyphenated-slug>, for example feat/5-github-auth-profile",
  );
  process.exit(1);
}

const [, type, issue, slug] = match;
console.log(`valid issue branch: type=${type}, issue=#${issue}, slug=${slug}`);
