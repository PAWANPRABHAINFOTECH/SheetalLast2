import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function CommentsSection() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    comment: ""
  });

  const { data: approvedComments } = useQuery({
    queryKey: ["approved-comments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.comment) {
      toast.error(t('comments.error_fields', 'कृपया नाम और टिप्पणी भरें'));
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("comments").insert({
        name: formData.name,
        mobile_number: formData.mobile,
        content: formData.comment,
        status: 'pending'
      });

      if (error) throw error;

      toast.success(t('comments.success', 'आपकी प्रतिक्रिया भेज दी गई है। एडमिन की अनुमति के बाद यह दिखाई देगी।'));
      setFormData({ name: "", mobile: "", comment: "" });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="h-6 w-6 text-primary" />
                <h2 className="font-hindi text-2xl font-bold text-primary">
                  {t('comments.title', 'अपनी प्रतिक्रिया दें')}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-2xl shadow-sm border border-primary/10">
                <div className="space-y-2">
                  <label className="font-hindi text-sm font-semibold">{t('comments.name', 'नाम')} *</label>
                  <Input 
                    placeholder={t('comments.name_placeholder', 'आपका नाम')}
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="font-hindi"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="font-hindi text-sm font-semibold">{t('comments.mobile', 'मोबाइल नंबर (वैकल्पिक)')}</label>
                  <Input 
                    placeholder="91XXXXXXXX"
                    value={formData.mobile}
                    onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="font-hindi text-sm font-semibold">{t('comments.message', 'प्रतिक्रिया')} *</label>
                  <Textarea 
                    placeholder={t('comments.message_placeholder', 'अपनी टिप्पणी लिखें...')}
                    rows={4}
                    value={formData.comment}
                    onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                    className="font-hindi"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 gap-2 font-hindi"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {t('comments.submit', 'प्रतिक्रिया भेजें')}
                </Button>
              </form>
            </div>

            {/* Display Approved Comments */}
            <div>
              <h3 className="font-hindi text-xl font-bold text-primary mb-6">
                {t('comments.recent', 'हालिया प्रतिक्रियाएँ')}
              </h3>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {approvedComments && approvedComments.length > 0 ? (
                  approvedComments.map((comment) => (
                    <div key={comment.id} className="bg-card/50 border-l-4 border-primary p-4 rounded-r-lg shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-hindi font-bold text-primary text-sm">{comment.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString('hi-IN')}
                        </span>
                      </div>
                      <p className="font-hindi text-sm text-foreground/80 italic">
                        "{comment.content}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground italic font-hindi">
                    {t('comments.empty', 'अभी तक कोई प्रतिक्रिया नहीं है। पहली प्रतिक्रिया आप दें!')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
