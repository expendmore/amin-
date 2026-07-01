import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding development multi-tenant structure...");

  const org = await prisma.organization.create({
    data: {
      name: "ExpendMore Enterprises"
    }
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: "Primary Workspace",
      organizationId: org.id
    }
  });

  console.log("Seed completed successfully.", { orgId: org.id, workspaceId: workspace.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
