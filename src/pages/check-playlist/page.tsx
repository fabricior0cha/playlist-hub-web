import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { PlaylistResponse } from "@/types/playlist";
import axios from "axios";
import { ArrowRight, CheckCircle2Icon, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function CheckPlaylistPage() {
  const BASE_URL = "https://playlist-hub-backend.vercel.app/api/playlists";
  const { id } = useParams();

  const [playlist, setPlaylist] = useState<PlaylistResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendPlaylist = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/${id}/commit`);

      window.open(response.data.authUrl, "_blank");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error on send playlist", error);
    }
  };

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/${id}`);
        setPlaylist(response.data);
      } catch (error) {
        console.error("Error on load playlist:", error);
      }
    };

    fetchPlaylist();
  }, [id]);

  return (
    <>
      <div className="min-h-screen bg-accent p-6">
        <div className="max-w-6xl mx-auto">
          {playlist ? (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-lg overflow-hidden shadow-xl border-4 border-white/20">
                      <img
                        src={playlist.imageUrl || "/placeholder-cover.jpg"}
                        alt={playlist.name || "Playlist cover"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex-1 text-white">
                    <div className="mb-4">
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white border-white/30 text-sm font-medium px-3 py-1"
                      >
                        {playlist.originalPlatform}
                      </Badge>
                    </div>

                    <h1 className="text-4xl font-bold mb-6 leading-tight">
                      {playlist.name || "Nome da Playlist"}
                    </h1>

                    <div className="flex flex-wrap items-center gap-2 text-white/80 text-lg">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">
                          {new Date(playlist.createdAt).getFullYear()}
                        </span>
                      </div>

                      <span className="mx-2">•</span>

                      <span>
                        {playlist.tracks?.length || 0} música
                        {(playlist.tracks?.length || 0) !== 1 ? "s" : ""}
                      </span>

                      {playlist.tracks && playlist.tracks.length > 0 && (
                        <>
                          <span className="mx-2">•</span>
                          <span>
                            {Math.round(
                              playlist.tracks.reduce(
                                (total, track) =>
                                  total + (track.durationMs || 0),
                                0
                              ) / 60000
                            )}{" "}
                            min
                          </span>
                        </>
                      )}
                    </div>

                    {playlist.description && (
                      <p className="mt-6 text-white/70 text-lg leading-relaxed max-w-2xl">
                        {playlist.description}
                      </p>
                    )}

                    <Button
                      className="mt-4 text-1xl px-4 hover:bg-green-600"
                      variant="default"
                      onClick={() => handleSendPlaylist()}
                    >
                      {loading ? (
                        <>
                          Sending...
                          <Loader2Icon className="animate-spin" />
                        </>
                      ) : (
                        <>
                          Send Playlist to {playlist.transformTo}
                          <ArrowRight />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="mt-10">
                  {playlist.tracks.map((track) => (
                    <>
                      <div
                        key={track._id}
                        className="flex items-center gap-4 p-4 border-b border-white/10"
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
                          <img
                            src={track.imageUrl}
                            alt={track.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">
                            {track.name}
                          </h4>
                        </div>
                        <div className="text-white/60 capitalize">
                          {track.artists.join(",")}
                        </div>
                        <div className="text-white/60">
                          {Math.round((track.durationMs || 0) / 60000)} min
                        </div>
                      </div>
                      <div className="px-12 py-4">
                        {track.links.map((link) => (
                          <Carousel>
                            <CarouselContent>
                              {link.candidates.map((candidate) => (
                                <CarouselItem className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                                  <Card
                                    className={`${
                                      candidate.isMain
                                        ? "border-2 border-green-500"
                                        : ""
                                    } bg-white/5 hover:bg-white/10 cursor-pointer shadow-lg relative`}
                                  >
                                    {candidate.isMain && (
                                      <CheckCircle2Icon
                                        fill="white"
                                        stroke="green"
                                        className="absolute -top-0.5 -right-0.5"
                                      />
                                    )}
                                    <CardContent className="px-4 flex flex-col items-center ">
                                      <div className="lg:w-42 h-42  rounded-lg overflow-hidden shadow-xl">
                                        <img
                                          src={candidate.imageUrl}
                                          alt={candidate.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="w-full">
                                        <span className="w-full text-white/80 font-bold text-ellipsis truncate block text-center mt-2">
                                          {candidate.name}
                                        </span>
                                        <span className="w-full text-white/60 text-ellipsis truncate block text-center capitalize mt-2">
                                          {candidate.artists.join(", ")}
                                        </span>
                                        <span className="w-full text-white/60 text-ellipsis truncate block text-center mt-2">
                                          {Math.round(
                                            (candidate.durationMs || 0) / 60000
                                          )}{" "}
                                          min
                                        </span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                          </Carousel>
                        ))}
                      </div>
                    </>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center text-white">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xl">Loading...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
