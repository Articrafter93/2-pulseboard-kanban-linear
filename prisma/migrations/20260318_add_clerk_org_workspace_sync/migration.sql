ALTER TABLE "Member"
ADD CONSTRAINT "Member_organizationId_userExternalId_key"
UNIQUE ("organizationId", "userExternalId");
