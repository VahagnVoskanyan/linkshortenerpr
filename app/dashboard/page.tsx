import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserLinks } from "@/lib/links";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateLinkModal } from "@/components/links/CreateLinkModal";
import { CopyLinkButton } from "@/components/links/CopyLinkButton";
import { LinkItemActions } from "@/components/links/LinkItemActions";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const userLinks = await getUserLinks(userId);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Your Links</h1>
            <p className="text-muted-foreground mt-2">
              Manage and track your shortened URLs
            </p>
          </div>
          <CreateLinkModal />
        </div>

        {userLinks.length === 0 ? (
          <Card className="border-2 border-dashed border-border">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="text-center">
                <p className="text-foreground text-xl font-semibold">
                  No links yet
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  Create your first short link to get started
                </p>
                <CreateLinkModal triggerLabel="Create Your First Link" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {userLinks.map((link) => (
              <Card
                key={link.id}
                className="hover:shadow-lg transition-all duration-200 border border-border"
              >
                <CardHeader className="pb-4 border-b border-border">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold text-foreground truncate">
                        {link.shortCode}
                      </CardTitle>
                      <p
                        className="text-sm text-muted-foreground mt-2 truncate"
                        title={link.originalUrl}
                      >
                        {link.originalUrl}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                      Created{" "}
                      {new Date(link.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <div className="flex gap-2">
                      <CopyLinkButton shortCode={link.shortCode} />
                      <LinkItemActions
                        id={link.id}
                        originalUrl={link.originalUrl}
                        shortCode={link.shortCode}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
