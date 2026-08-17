import { useMembers } from "@/lib/temple.hooks";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function FeaturedMembers() {
  const { data: members, isLoading } = useMembers();

  if (isLoading) return <div className="h-96 w-full animate-pulse bg-muted rounded-3xl" />;

  // Display top 3 main members (e.g., President, Secretary, Treasurer)
  const featured = members?.filter(m => m.show_on_home).slice(0, 3) || [];

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="font-hindi text-3xl md:text-5xl font-bold text-primary mb-4">
          प्रमुख पदाधिकारी
        </h2>
        <p className="font-hindi text-lg text-foreground/70 max-w-2xl mx-auto">
          मंदिर समिति के समर्पित सदस्य जो व्यवस्था और निर्माण कार्यों की देखरेख कर रहे हैं।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {featured.map((member) => (
          <Card key={member.id} className="text-center p-8 border-primary/10 hover:shadow-2xl transition-all hover:-translate-y-2">
            <CardContent className="p-0">
              <Avatar className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 border-4 border-white shadow-lg ring-4 ring-primary/5">
                <AvatarImage src={member.photo_url || ""} className="object-cover" />
                <AvatarFallback className="font-hindi text-2xl">{member.name[0]}</AvatarFallback>
              </Avatar>
              <h3 className="font-hindi text-xl font-bold text-primary mb-2">{member.name}</h3>
              <p className="font-hindi text-secondary font-semibold mb-4">{member.designation}</p>
              <div className="h-1 w-12 bg-secondary/30 mx-auto rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-hindi rounded-full px-8" asChild>
          <Link to="/members">सभी पदाधिकारी एवं सदस्य देखें</Link>
        </Button>
      </div>
    </div>
  );
}
