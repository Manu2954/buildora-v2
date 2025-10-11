ALTER TABLE "Project"
ADD COLUMN "customerId" TEXT;

ALTER TABLE "Project"
ADD CONSTRAINT "Project_customerId_fkey"
FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Project_customerId_idx" ON "Project"("customerId");
