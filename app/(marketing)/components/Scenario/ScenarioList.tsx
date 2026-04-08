import Scenario from "./Scenario";
import { ScenarioListHeader } from "./ScenarioListHeader";
import { ScenarioItem, SCENARIOS } from "./scenarioContent";

export default function ScenarioList() {
  return (
    <main id="scenarios" className="mt-1 min-h-screen h-full w-full md:mt-10">
      <ScenarioListHeader />

      {SCENARIOS.map((scenario: ScenarioItem) => (
        <Scenario key={scenario.id} scenario={scenario} />
      ))}
    </main>
  );
}
