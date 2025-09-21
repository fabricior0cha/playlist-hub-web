"use client";

import axios from "axios";
import { Loader2Icon, Play } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export default function MigratePage() {
  const BASE_URL = "https://playlist-hub-backend.vercel.app/api/playlists";

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyPlatform = () => {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.toLowerCase();

      const platforms: Record<string, "YOUTUBE" | "SPOTIFY"> = {
        "spotify.com": "SPOTIFY",
        "youtube.com": "YOUTUBE",
        "youtu.be": "YOUTUBE",
        "music.youtube.com": "YOUTUBE",
      };

      for (const domain in platforms) {
        if (hostname.endsWith(domain)) {
          return platforms[domain];
        }
      }

      return null;
    } catch (error) {
      console.error("Error verifying platform:", error);
      return null;
    }
  };

  const isValid = !!handleVerifyPlatform();

  const handleMigrate = async () => {
    const platform = handleVerifyPlatform();

    if (!platform) return;

    try {
      setLoading(true);
      const response = await axios.post(BASE_URL, {
        url,
        transformTo: platform == "YOUTUBE" ? "SPOTIFY" : "YOUTUBE",
      });
      if (response.data._id) {
        setLoading(false);
        navigate(`/check-playlist/${response.data._id}`);
      }
    } catch (error) {
      setLoading(false);
      console.error("Erro ao analisar a playlist:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-accent flex-col items-center justify-center">
      <div className="w-2xl mx-auto mb-12">
        <Card className="shadow-lg ">
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=example"
                className="flex-1 h-12 text-base border-border"
              />

              <Button
                disabled={!isValid}
                className="h-12 px-8 "
                onClick={() => handleMigrate()}
              >
                <>
                  {loading ? (
                    <>
                      <Loader2Icon className="animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Migrate"
                  )}{" "}
                  <Play />
                </>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
