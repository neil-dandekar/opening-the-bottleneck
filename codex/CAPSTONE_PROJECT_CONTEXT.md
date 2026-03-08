# DSC Capstone Context for Codex

## Project: Interactive Concept Intervention Interface for Concept Bottleneck LLMs

### Purpose of this file

This file gives Codex the **project context** needed to build, modify, and maintain the capstone codebase correctly. It explains:

- what the capstone project is
- how it relates to the original **ICLR 2025 paper, “Concept Bottleneck Large Language Models”**
- what the software being built is supposed to do
- how the interface should behave
- what users should be able to learn from it
- how intervention works conceptually for this project
- what assumptions Codex should preserve while implementing features

This file is intended to be a **working engineering and product context document**, not a research paper summary. It should help Codex make implementation decisions that stay faithful to the CB-LLM paper while serving the capstone’s goals.

---

## 1. High-level project summary

This capstone is an **interactive research and educational tool** for exploring **Concept Bottleneck Large Language Models (CB-LLMs)** through **concept intervention**.

The project is **not** trying to propose a new model architecture. Instead, it is building a **front-end and system around the paper’s ideas** so that researchers, students, and other users can:

- inspect concept activations
- manually intervene on concepts
- observe how interventions change model outputs
- compare baseline vs intervened behavior
- understand the tradeoff between **steerability** and **task performance**
- build intuition for what it means to control model behavior through interpretable concepts

In practice, the capstone centers on a **GUI / website-based interface** that wraps around pretrained CB-LLM checkpoints and exposes the model’s concept bottleneck in a way that is interactive and visually understandable.

---

## 2. Relation to the original ICLR 2025 paper

### Original paper

The core research paper is:

**“Concept Bottleneck Large Language Models” (ICLR 2025)**  
by Cheng En Sun, Lily Weng, et al.

The paper introduces the idea of adapting the **concept bottleneck model paradigm** to large language models. Rather than mapping inputs directly to outputs, the model passes information through an interpretable intermediate representation, a **concept bottleneck**.

This bottleneck enables:

- inspection of intermediate concept values
- intervention on those concept values
- controlled steering of the model’s downstream output
- explicit study of tradeoffs between interpretability and performance

### What this capstone does with that paper

This capstone is a **tooling and interaction layer built around the paper’s framework**.

It takes the paper’s core ideas and turns them into a usable interface that supports:

- concept-level control
- real-time experimentation
- visualization of intervention effects
- interpretability-focused workflows for both classification and, potentially, generation tasks

So the relationship is:

- **The paper provides the model architecture, training framing, and evaluation ideas.**
- **The capstone provides the user-facing system that makes those ideas explorable.**

This means Codex should preserve fidelity to the paper’s conceptual structure, especially:

- the existence of an explicit concept bottleneck
- the idea that concept activations are the interpretable intervention point
- the distinction between **baseline inference** and **intervened inference**
- the fact that steering is meaningful only relative to downstream output changes
- the paper’s emphasis on the **accuracy vs steering** tradeoff

---

## 3. Core idea of the capstone product

The product is essentially a **control panel for CB-LLMs**.

A user supplies an input, such as:

- a text example for classification
- a prompt for generation
- a dataset example chosen from a supported benchmark

The system then:

1. runs the pretrained CB-LLM normally
2. exposes the concept bottleneck activations
3. lets the user manually adjust selected concepts
4. reruns downstream prediction using the modified bottleneck values
5. shows how the output changed

This allows users to ask questions like:

- What concepts were most active for this example?
- Which concepts seem most responsible for the model’s prediction?
- Can I flip the classification by changing a few concepts?
- How sensitive is the output to a given concept?
- Are some concepts causally influential while others are mostly descriptive?
- What happens when I push a concept to an extreme?
- How does stronger steerability affect overall accuracy?

---

## 4. Primary use cases

The capstone tool is useful for several types of users.

### A. Interpretability research

Researchers can use the interface to study whether intervening on interpretable concepts produces meaningful and controllable behavior changes.

### B. Education

Students who are new to concept bottleneck models, interpretability, or steering can use the tool to build intuition interactively instead of only reading equations or static figures.

### C. Demo / communication

The capstone serves as a demonstration platform that makes the CB-LLM paper easier to present to others, including instructors, classmates, and non-specialists.

### D. Qualitative debugging

Users can inspect surprising predictions and check whether the concept layer reveals a plausible reason for the model’s behavior.

### E. Analysis of steerability-performance tradeoffs

The interface can visualize how different intervention strengths or bottleneck settings relate to downstream task accuracy and steering score.

---

## 5. What the project is **not**

Codex should avoid drifting into the wrong product scope.

This project is **not**:

- a generic LLM chatbot
- a general-purpose prompt engineering playground
- a purely aesthetic paper-summary site
- a new training pipeline for inventing a different CB-LLM variant
- a benchmark leaderboard only
- a hidden-end-to-end black box demo

The important thing is that the user should be able to interact with the **concept bottleneck itself**.

---

## 6. Supported task modes

The capstone is centered on two broad task modes.

### 6.1 Classification mode

This is the clearest and most important mode for intervention.

Examples may include datasets such as:

- SST-2
- AG News
- other classification datasets supported by the pretrained CB-LLM checkpoints

In classification mode, the output is something like:

- predicted class
- confidence / probability distribution
- top active concepts
- changes in prediction under intervention

This mode is especially useful because interventions are easier to interpret quantitatively.

### 6.2 Generation mode

Generation may also be supported, but it is conceptually more complex.

In generation mode, intervention affects the concept bottleneck used for downstream text generation. The output change may be observed as:

- different style
- different semantic emphasis
- different content tendencies
- changes in generated response direction

Generation should be treated carefully because its effects are often less cleanly measurable than classification. If the implementation focuses first on classification, that is acceptable and aligned with the capstone’s likely MVP.

---

## 7. Concept intervention: how it should be understood in this project

### Key principle

The user is **not editing raw model weights**.  
The user is **not retraining the model live**.  
The user is editing the **intermediate concept representation** in the CB bottleneck.

That bottleneck consists of interpretable concept activations. These are the variables that summarize concept presence, strength, or relevance before the downstream prediction module consumes them.

### Practical interpretation

For this project, concept intervention means:

- run the input through the encoder / pretrained model up to the concept bottleneck
- obtain the vector of concept activations
- allow the user to change one or more concept values
- pass the modified concept vector into the downstream predictor / decoder
- compare the new output to the baseline output

### What a slider means

If the UI uses sliders, a slider does **not** mean “turning a neuron on or off” in a binary sense unless the specific model defines it that way.

Instead, the slider should be interpreted as changing the **activation value of a concept dimension** in the bottleneck representation.

A good mental model is:

- **0 or default**: no manual intervention, use the model’s original bottleneck value
- **positive shift**: increase the presence / strength / influence of that concept relative to baseline
- **negative shift**: decrease the presence / strength / influence of that concept relative to baseline

If the UI uses a range like **-5 to 5**, this should usually be treated as an intervention scale or offset around a neutral baseline, not as a literal probability percentage.

### Important implementation note

Codex should preserve the distinction between:

- the model’s **natural** concept activation for the input
- the user’s **intervened** concept activation

The UI should make baseline vs edited values obvious.

---

## 8. How the project works, system view

At a high level, the software should follow this flow:

### Step 1: Choose task and example

The user selects:

- a task mode
- a model / checkpoint
- a dataset example or custom input

### Step 2: Run baseline inference

The system computes:

- baseline output
- concept bottleneck activations
- possibly top-k most active concepts
- confidence scores / logits / probabilities
- any relevant metadata

### Step 3: Expose concepts to the user

The interface shows concepts in a way that is easy to inspect, for example:

- ranked by activation
- searchable
- grouped
- filterable
- with descriptions or human-readable names

### Step 4: Apply intervention

The user modifies selected concepts through:

- sliders
- numeric inputs
- toggles
- presets
- targeted “push positive / push negative” controls

### Step 5: Run intervened inference

The system reuses the modified concept vector and computes the new downstream output.

### Step 6: Compare results

The UI should show:

- baseline vs intervened prediction
- baseline vs intervened confidence
- changed concepts
- which concepts moved most
- whether the class flipped
- how large the output change was

### Step 7: Optional aggregate analysis

The tool may also support:

- repeated experiments
- saved interventions
- charts of steering score vs accuracy
- example galleries
- concept sensitivity analysis

---

## 9. Why this is useful

This capstone matters because most model behavior analysis tools still operate at one of two extremes:

1. **black-box prompting**, which is easy but not interpretable
2. **weight-level / activation-level mechanistic analysis**, which is powerful but inaccessible to many users

CB-LLMs create a middle ground:

- more structured than prompt-only steering
- more interpretable than hidden-state probing without semantic labels
- more user-facing than raw mechanistic interpretability tooling

The capstone tool makes that middle ground tangible.

It helps users understand not just **what the model predicted**, but **how concept-level internal structure can be inspected and altered**.

---

## 10. Expected user experience

The interface should feel like a research instrument, not just a demo toy.

That means the UX should emphasize:

- clarity
- traceability
- side-by-side comparison
- interpretability
- visible cause-and-effect

A user should be able to answer:

- What happened?
- Why did it happen?
- Which concept caused the change?
- How strong was the intervention?
- Was the change plausible or extreme?

The interface should therefore prioritize:

- readable layout
- explicit labels
- baseline vs edited comparisons
- stable and responsive controls
- low confusion about what each slider or concept value means

---

## 11. Accuracy vs steering tradeoff

One of the important ideas from the paper is that concept bottlenecks create a tradeoff space between:

- **task performance / accuracy**
- **steerability / controllability**

This capstone should make that tradeoff visible.

### Intuition

A representation can be more steerable if it isolates interpretable concepts clearly. But enforcing or exposing that interpretable structure may reduce raw task performance compared to a less constrained end-to-end model.

Similarly, stronger interventions may produce more visible output changes, but those changes can also degrade correctness or naturalness.

### What the UI should communicate

When possible, the tool should visualize:

- baseline performance
- performance after intervention
- steering score or some measure of controllable change
- how these relate across settings, models, or tasks

This is important because the project is not only about “can we change the output?” but also:

- how controllable the model is
- how reliable that control is
- what cost comes with that control

---

## 12. Design philosophy for Codex

When implementing features, Codex should optimize for the following principles.

### Faithful to the paper

Do not invent model behavior that contradicts the CB-LLM framing.

### Interpretable first

The bottleneck should be the star of the interface.

### Comparison-heavy

Baseline and intervention should almost always be shown side by side.

### Experiment-friendly

Users should be able to try many interventions quickly.

### Educational clarity

The system should explain enough that a technically curious user can understand what they are changing.

### Modular

The codebase should cleanly separate:

- model loading
- inference
- concept extraction
- intervention logic
- visualization / UI state
- dataset example management

---

## 13. How to use the tool, from an end-user perspective

A typical usage flow should look like this:

1. Open the interface.
2. Select a model / task.
3. Pick a sample input or enter custom text.
4. Run the baseline model.
5. Inspect the predicted output and active concepts.
6. Choose one or more concepts to modify.
7. Adjust sliders or intervention values.
8. Rerun or live-update the downstream prediction.
9. Compare baseline vs intervened outputs.
10. Reset, save, or continue experimenting.

The user should not need to understand every architectural detail in order to use the system, but the interface should still support deeper inspection for advanced users.

---

## 14. Important assumptions Codex should preserve

Codex should preserve these assumptions unless the surrounding code clearly requires otherwise.

### Assumption 1

The pretrained CB-LLM checkpoints already exist and are the model source of truth.

### Assumption 2

The project is primarily about **interacting with** CB-LLMs, not retraining them from scratch.

### Assumption 3

Concept names should be exposed in a human-readable way whenever available.

### Assumption 4

Intervention should happen at the concept bottleneck representation, before the downstream output layer / decoder consumes it.

### Assumption 5

The UI should distinguish:

- baseline activation
- user-edited activation
- resulting output

### Assumption 6

Classification is the most concrete and easiest mode to make robust first.

### Assumption 7

The project should support explanation and demonstration, not only prediction.

---

## 15. Recommended UI building blocks

Depending on the stack, Codex may implement or preserve components like:

- **Task selector**
- **Model selector**
- **Dataset example picker**
- **Custom text input**
- **Baseline prediction panel**
- **Concept list panel**
- **Top concepts summary**
- **Intervention slider panel**
- **Intervention history / reset controls**
- **Baseline vs intervened comparison view**
- **Confidence / probability chart**
- **Accuracy vs steering visualization**
- **Explanatory help text / tooltips**

The exact visual style can vary, but the underlying logic should remain centered on concept-level intervention.

---

## 16. What “good” looks like for this capstone

A strong implementation should let someone do the following within a minute or two:

- choose an example
- see the model’s baseline prediction
- identify relevant concepts
- intervene on a few concepts
- rerun the model
- observe a meaningful output change
- understand what changed and why

If the system can do that clearly and reliably, it is serving the capstone well.

---

## 17. Guidance for future extensions

Possible future extensions include:

- generation-focused intervention workflows
- concept search and grouping
- intervention presets
- intervention logging and replay
- per-concept sensitivity curves
- concept attribution views
- aggregate experiment dashboards
- exporting intervention sessions for reports or demos

These are useful, but they should not come at the expense of the core functionality:
**interactive, understandable concept intervention on a CB-LLM.**

---

## 18. Final takeaway for Codex

This capstone is best understood as an **interactive interpretability and steering interface for Concept Bottleneck LLMs**.

The original paper provides the model idea:

- route information through interpretable concepts
- expose those concepts as an intervention point
- analyze the tradeoff between performance and steerability

This project turns that idea into a usable system.

When making implementation decisions, always prioritize:

1. faithfulness to the CB-LLM bottleneck idea
2. visibility of concept activations
3. easy intervention workflows
4. clear baseline vs edited comparison
5. support for understanding, not just output generation

If unsure between a flashy feature and an interpretable one, prefer the interpretable one.
