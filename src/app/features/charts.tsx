// app/charts/page.tsx (or wherever your component lives)
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";

import { CrazyHotChart } from "@/components/charts/CrazyHotChart";
import { FafoChart } from "@/components/charts/FafoChart";

export default function ChartsUI() {
  const [hotness, setHotness] = useState(5);
  const [craziness, setCraziness] = useState(4);

  const [userInput, setUserInput] = useState("");
  const [fuckAround, setFuckAround] = useState<number | null>(null);
  const [findOut, setFindOut] = useState<number | null>(null);
  const [fafo, setFafo] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    zone: string;
    explanation: string;
  }>(null);

  // Reset on empty input
  useEffect(() => {
    if (userInput.trim() === "") {
      const id = setTimeout(() => {
        setResult(null);
        setFuckAround(null);
        setFindOut(null);
        setFafo(null);
      }, 0);
      return () => clearTimeout(id);
    }
  }, [userInput]);

  async function analyzeCrazyHot() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/crazy-hot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chart: "CRAZY_HOT",
          input: { hotness, craziness },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "API error");
      setResult(data);
    } catch (err) {
      console.error("Crazy/Hot analysis failed:", err);
      setResult({
        zone: "ERROR",
        explanation: "Analysis failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function analyzeFafo() {
    if (!userInput.trim()) return;

    setLoading(true);
    // Show intermediate state
    setResult({ zone: "THINKING", explanation: "Decoding intent…" });

    try {
      const res = await fetch("/api/fafo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chart: "FAFO",
          input: userInput.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unknown error");
      }

      const inferredFA = typeof data.fuckAround === "number" ? data.fuckAround : 5;
      const inferredFO = typeof data.findOut === "number" ? data.findOut : 5;

      setFuckAround(inferredFA);
      setFindOut(inferredFO);
      setFafo(inferredFA);

      // Brief intermediate state
      setResult({
        zone: "CALCULATING",
        explanation: `F*** Around: ${inferredFA}, Find Out: ${inferredFO}`,
      });

      // Final result after tiny delay for UX flow
      setTimeout(() => {
        setResult({
          zone: data.zone,
          explanation: data.explanation,
        });
      }, 600);
    } catch (err) {
      console.error("FAFO analysis failed:", err);
      setResult({
        zone: "ERROR",
        explanation: `Analysis failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      });
    } finally {
      setLoading(false);
    }
  }

  // Zone color mapping (for dynamic styling)
  const getZoneColorClass = (zone: string) => {
    switch (zone) {
      case "SAFE": return "text-green-400 border-l-green-500";
      case "WARNING": return "text-yellow-400 border-l-yellow-500";
      case "FAFO": return "text-orange-400 border-l-orange-500";
      case "DISASTER": return "text-red-400 border-l-red-500";
      case "LEGENDARY": return "text-purple-400 border-l-purple-500";
      case "ERROR": return "text-red-400 border-l-red-500";
      case "THINKING": return "text-blue-400 border-l-blue-500";
      case "CALCULATING": return "text-yellow-400 border-l-yellow-500";
      default: return "text-gray-400 border-l-gray-500";
    }
  };

  function handleShare() {
  if (!result || fuckAround === null || findOut === null) return;

  const shareText = `FAFO Chart Result 🚨

F*** Around: ${fuckAround}/10
Find Out: ${findOut}/10
Zone: ${result.zone}

"${result.explanation}"

Chaos evaluated at Chaos Labs 🌀`;

  if (navigator.share) {
    navigator.share({
      title: "FAFO Chart Result",
      text: shareText,
      url: window.location.href,
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(shareText).then(() => {
      alert("Result copied to clipboard 📋");
    });
  }
}


  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header with theme toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center flex-1">
          Chaos Evaluation Dashboard
        </h1>
        <ThemeToggle />
      </div>

      {/* Global loading indicator */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <div className="h-2 w-2 bg-orange-400 rounded-full animate-ping"></div>
          <span>
            {userInput.trim() ? "Decoding chaos level…" : "Consulting the chaos matrix…"}
          </span>
        </div>
      )}

      <Tabs defaultValue="crazy-hot" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="crazy-hot">Crazy / Hot Matrix</TabsTrigger>
          <TabsTrigger value="fafo">FAFO Index</TabsTrigger>
        </TabsList>

        {/* Crazy Hot Tab */}
        <TabsContent value="crazy-hot">
          <Card className="rounded-2xl shadow-lg border border-gray-800 bg-gray-900 dark:bg-gray-900">
            <CardContent className="space-y-6 p-6">
              <h2 className="text-xl font-semibold">Crazy–Hot Scale</h2>

              <CrazyHotChart hotness={hotness} craziness={craziness} />

              <div>
                <label className="block text-sm mb-1">Hotness: {hotness}/10</label>
                <Slider
                  value={[hotness]}
                  max={10}
                  step={1}
                  onValueChange={([v]) => setHotness(v)}
                  aria-label="Hotness level"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Craziness: {craziness}/10</label>
                <Slider
                  value={[craziness]}
                  min={4}
                  max={10}
                  step={1}
                  onValueChange={([v]) => setCraziness(v)}
                  aria-label="Craziness level"
                />
              </div>

              <Button
                className="w-full"
                onClick={analyzeCrazyHot}
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Analyze"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAFO Tab */}
        <TabsContent value="fafo">
          <Card className="rounded-2xl shadow-lg border border-gray-800 bg-gray-900 dark:bg-gray-900">
            <CardContent className="space-y-6 p-6">
              <h2 className="text-xl font-semibold">FAFO Index (Free-Text Mode)</h2>

              {/* Input guidance */}
              <div className="text-xs text-muted-foreground mb-3 space-y-1.5">
                <p>⚠️ Describe your intended action honestly.</p>
                <p className="font-medium">Examples:</p>
                <ul className="list-disc list-inside pl-4 space-y-0.5">
                  <li><code className="text-xs bg-muted/30 px-1.5 py-0.5 rounded">I&apos;ll ignore the &quot;critical&quot; server alert.</code></li>
                  <li><code className="text-xs bg-muted/30 px-1.5 py-0.5 rounded">&quot;Sure.&quot; auto-reply to all emails.</code></li>
                </ul>
              </div>

              <div>
                <label 
                  htmlFor="fafo-input" 
                  className="block text-sm font-medium mb-2"
                >
                  What are you about to do?
                </label>
                <Textarea
                  id="fafo-input"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="e.g., 'I changed my manager’s desktop to a disappointed owl…'"
                  className="w-full p-3 text-sm rounded-lg border border-gray-700 bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (userInput.trim() && !loading) analyzeFafo();
                    }
                  }}
                  aria-describedby="fafo-hint"
                />
                <p id="fafo-hint" className="sr-only">
                  Press Enter to analyze. Example: I will reply &quot;Sure.&quot; to every email today.
                </p>
              </div>

              {/* Chart & inferred values */}
              {fafo !== null && fuckAround !== null && findOut !== null && (
                <>
                  <FafoChart fafo={fafo} />
                  <div className="text-sm text-muted-foreground bg-gray-800/50 p-3 rounded-md border border-gray-700">
                    <strong>Inferred values:</strong> F*** Around = {fuckAround}, Find Out = {findOut}
                  </div>
                </>
              )}

              {/* Empty state */}
              {!fafo && !result && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-4xl mb-2">🌀</div>
                  <p className="font-medium">Describe your chaos.</p>
                  <p className="text-sm">The universe is waiting…</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  className="flex-1"
                  onClick={analyzeFafo}
                  disabled={loading || !userInput.trim()}
                  aria-busy={loading}
                >
                  {loading ? "Consulting..." : "Find Out"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (userInput.trim() && !confirm("Clear input and results?")) return;
                    setUserInput("");
                    setResult(null);
                    setFuckAround(null);
                    setFindOut(null);
                    setFafo(null);
                  }}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Result Card */}
      {result && (
        <Card 
          className={`mt-6 transition-all duration-300 border-l-4 ${getZoneColorClass(result.zone)} 
            bg-gray-900/80 backdrop-blur-sm`}
        >
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {/* Animated indicator for transient states */}
              {result.zone === "THINKING" && (
                <span className="h-2.5 w-2.5 bg-blue-400 rounded-full animate-pulse"></span>
              )}
              {result.zone === "CALCULATING" && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400"></span>
                </span>
              )}
              Zone:{" "}
              <span className={getZoneColorClass(result.zone).split(" ")[0]}>
                {result.zone}
              </span>
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {result.explanation}
            </p>

            <div className="pt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="text-xs"
              >
                Share Chaos 🔥
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}