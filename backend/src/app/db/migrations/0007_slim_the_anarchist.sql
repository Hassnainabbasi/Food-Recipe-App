CREATE TABLE "revoked_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" varchar(512) NOT NULL,
	"expiredAt" timestamp NOT NULL
);
