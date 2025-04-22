import { useState } from "react";
import { useTournament } from "@/context/TournamentContext";
import { Match, MatchResult } from "@/types/cricket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AdminMatchFormProps {
  match: Match;
  onClose: () => void;
}

const AdminMatchForm = ({ match, onClose }: AdminMatchFormProps) => {
  const { updateMatch, getTeamById } = useTournament();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const teamA = getTeamById(match.team1);
  const teamB = getTeamById(match.team2);

  const [winner, setWinner] = useState<string>(match.result?.winner || "");
  const [winningTeamScore, setWinningTeamScore] = useState<string>(
    match.result?.winningTeamScore || ""
  );
  const [losingTeamScore, setLosingTeamScore] = useState<string>(
    match.result?.losingTeamScore || ""
  );
  const [winMargin, setWinMargin] = useState<string>(
    match.result?.winMargin || ""
  );

  const [winningTeamOversFaced, setWinningTeamOversFaced] =
    useState<string>("");
  const [LosingTeamOversFaced, setLosingTeamOversFaced] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!winner || !winningTeamScore || !losingTeamScore || !winMargin) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all required fields",
      });
      return;
    }

    if (!winningTeamOversFaced || !LosingTeamOversFaced) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide overs faced and overs bowled",
      });
      return;
    }

    const parseOvers = (oversStr: string): number => {
      if (!oversStr) return 0;
      const parts = oversStr.split(".");
      const whole = parseInt(parts[0]) || 0;
      const part = parseInt(parts[1]) || 0;
      return whole + (part > 0 ? part / 6 : 0);
    };

    const runsScored = parseInt(winningTeamScore.split("/")[0]);
    const runsConceded = parseInt(losingTeamScore.split("/")[0]);
    const winningTeamOversFacedNum = parseOvers(winningTeamOversFaced);
    const losingTeamOversFacedNum = parseOvers(LosingTeamOversFaced);

    const nrr =
      runsScored / winningTeamOversFacedNum -
      runsConceded / losingTeamOversFacedNum;

    // Create result object
    const result: MatchResult = {
      winner,
      loser:
        winner === "Tie"
          ? "Tie"
          : winner === match.team1
          ? match.team2
          : match.team1,
      winningTeamScore,
      losingTeamScore,
      winMargin,
      winningTeamOversFaced: winningTeamOversFacedNum,
      losingTeamOversFaced: losingTeamOversFacedNum,
      nrr: parseFloat(nrr.toFixed(3)), // Use 3 decimal places for consistency
    };

    // Update match
    const updatedMatch: Match = {
      ...match,
      status: "completed",
      result,
    };

    try {
      setLoading(true);
      await updateMatch(updatedMatch);
      onClose();
    } catch (error) {
      console.error("Error updating match:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="winner">Winner</Label>
        <Select value={winner} onValueChange={setWinner}>
          <SelectTrigger id="winner">
            <SelectValue placeholder="Select winner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={match.team1}>
              {teamA?.name || match.team1}
            </SelectItem>
            <SelectItem value={match.team2}>
              {teamB?.name || match.team2}
            </SelectItem>
            <SelectItem value={"Tie"}>Tie</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="winningTeamScore">Winning Team Score</Label>
          <Input
            id="winningTeamScore"
            placeholder="e.g. 186/4"
            value={winningTeamScore}
            onChange={(e) => setWinningTeamScore(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="losingTeamScore">Losing Team Score</Label>
          <Input
            id="losingTeamScore"
            placeholder="e.g. 174/8"
            value={losingTeamScore}
            onChange={(e) => setLosingTeamScore(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="winMargin">Winning Margin</Label>
        <Input
          id="winMargin"
          placeholder="e.g. 12 runs or 6 wickets"
          value={winMargin}
          onChange={(e) => setWinMargin(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="oversFaced">Overs Faced (Winning Team)</Label>
          <Input
            id="oversFaced"
            placeholder="e.g. 5.3"
            value={winningTeamOversFaced}
            onChange={(e) => setWinningTeamOversFaced(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="LosingTeamOversFaced">
            Overs Faced (Losing Team)
          </Label>
          <Input
            id="LosingTeamOversFaced"
            placeholder="e.g. 20"
            value={LosingTeamOversFaced}
            onChange={(e) => setLosingTeamOversFaced(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Result"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AdminMatchForm;
