# CB-LLM Knowledge File

## 1. Paper Metadata

- title: Concept Bottleneck Large Language Models
- venue: UNSPECIFIED IN PAPER (Inference: manuscript is formatted with `iclr2025_conference` style)
- authors: Chung-En Sun; Tuomas Oikarinen; Berk Ustun; Tsui-Wei Weng
- task domains: text classification; autoregressive text generation; controllable/safety-oriented chatbot behavior (toxicity detection/reduction)
- core contribution: A framework that converts pretrained black-box LLMs into concept-bottleneck models with intrinsic interpretability for both classification and generation, including scalable concept labeling/correction (ACS/ACC) and an adversarial disentanglement module for steerable generation.

## 2. One-Paragraph Summary

CB-LLMs introduces concept bottleneck modeling for LLMs in two settings: text classification and text generation. For classification, concepts are generated per class via ChatGPT, pseudo-labeled with sentence-embedding similarity (ACS), corrected with a class-consistency rule (ACC), then learned in a concept bottleneck layer (CBL) before a sparse linear predictor; this reaches near-black-box or better accuracy on SST2, YelpP, AGnews, and DBpedia while improving human-rated faithfulness over prior CBM-style text baselines. For generation, the model uses a hybrid architecture (interpretable CBL + unsupervised branch) and an adversarial training module that pushes the unsupervised branch to remove concept information, improving steerability under neuron intervention while maintaining competitive accuracy/perplexity. Case studies demonstrate concept unlearning in classification and toxicity-aware detection/steering in chatbot generation.

## 3. Core Architecture

### 3.1 Classification architecture

- backbone: Pretrained LM `f_LM` (experiments: `RoBERTa-base`, `GPT2`; appendix also `Gemma2-2B`).
- concept source: ChatGPT-generated concept subsets per class, then unioned into concept set `\mathcal{C}`.
- concept labels: Pseudo-label scores from ACS using sentence embedding similarity (`all-mpnet-base-v2`), then corrected by ACC.
- CBL: `f_CBL: \mathbb{R}^d \to \mathbb{R}^k`; trained with LM to maximize similarity between CBL activations and corrected concept scores.
- final layer: Sparse linear layer `(W_F, b_F)` maps non-negative concept activations to class logits.
- activation processing: `A_N(x)=f_CBL(f_LM(x))`; then `A_N^+(x)=ReLU(A_N(x))` (negative activations zeroed for interpretability).
- loss terms: similarity objective for LM+CBL; classification cross-entropy with elastic-net regularization for final linear layer (`\lambda=0.0007`, `\alpha=0.99`).

### 3.2 Generation architecture

- backbone: Pretrained autoregressive LLM `f_LLM` (main experiments: `Llama3-8B`; appendix: `Llama2-13B`, `Mistral-7B`).
- CBL: `f_CBL^+ : \mathbb{R}^d \to \mathbb{R}^k` (ReLU applied), supervised by concept labels.
- unsupervised branch: Parallel layer `f_unsup : \mathbb{R}^d \to \mathbb{R}^u` to carry non-concept information needed for generation.
- final layer: `f_FL : \mathbb{R}^{k+u} \to \mathbb{R}^{|\mathcal{V}|}`, unembedding concatenated `(CBL || unsup)` features to token logits.
- adversarial module: Linear concept detector `g_c` on unsupervised features; optimize detector with detection loss and optimize unsupervised branch with negative entropy to remove concept information.
- inference-time components: `f_LLM`, `f_CBL^+`, `f_unsup`, `f_FL`; optional manual intervention on CBL neuron activations.
- discarded training-only components: adversarial detector `g_c` and its training objective path (Module 2) are discarded at inference.

## 4. Key Objects and Symbols

| symbol                  | meaning                                         | shape if inferable                                        | where it appears                         |
| ----------------------- | ----------------------------------------------- | --------------------------------------------------------- | ---------------------------------------- | --- | ------------------------------ |
| `\mathcal{D}`           | dataset                                         | set of `(x,y)` (or sequence/labels)                       | classification and generation training   |
| `x`                     | text sample / prefix                            | token sequence                                            | both                                     |
| `y`                     | class label or next-token label                 | scalar class id or token id                               | both                                     |
| `y_c`                   | concept label                                   | class/concept id(s), exact encoding UNSPECIFIED IN PAPER  | generation Module 1/2                    |
| `n`                     | number of classes                               | scalar                                                    | classification concept generation        |
| `\mathcal{C}_i`         | concept subset for class `i`                    | set                                                       | classification Step 1                    |
| `\mathcal{C}`           | full concept set `\cup_i \mathcal{C}_i`         | set of size `k`                                           | classification                           |
| `k`                     | number of concepts / CBL neurons                | scalar                                                    | both                                     |
| `u`                     | number of unsupervised neurons                  | scalar                                                    | generation                               |
| `d`                     | LM latent dimension                             | scalar                                                    | both                                     |
| `\mathcal{V}`           | vocabulary                                      | set, size `                                               | \mathcal{V}                              | `   | generation                     |
| `\mathcal{E}`           | sentence embedding model                        | text -> `\mathbb{R}^d`                                    | ACS in classification                    |
| `S_c(x)`                | ACS concept score vector                        | `\mathbb{R}^k`                                            | classification Step 2                    |
| `S_c^{ACC}(x)`          | corrected concept score vector                  | `\mathbb{R}^k`                                            | classification Step 3                    |
| `\mathcal{M}`           | concept-to-class mapping                        | `c -> {1,...,n}`                                          | ACC rule                                 |
| `f_{LM}`                | classification backbone LM                      | `x -> \mathbb{R}^d`                                       | classification                           |
| `f_{LLM}`               | generation backbone LLM                         | prefix -> hidden state                                    | generation                               |
| `f_{CBL}` / `f_{CBL}^+` | concept bottleneck layer                        | `\mathbb{R}^d -> \mathbb{R}^k`                            | both                                     |
| `f_{unsup}`             | unsupervised branch                             | `\mathbb{R}^d -> \mathbb{R}^u`                            | generation                               |
| `f_{FL}`                | final output layer                              | `\mathbb{R}^{k+u} -> \mathbb{R}^{                         | \mathcal{V}                              | }`  | generation                     |
| `g_c`                   | concept detector on unsup features              | `\mathbb{R}^u ->` concept logits                          | generation adversarial module            |
| `A_N(x)`                | CBL neuron activations                          | `\mathbb{R}^k`                                            | classification                           |
| `A_N^+(x)`              | non-negative CBL activations                    | `\mathbb{R}^k`                                            | classification                           |
| `W_F, b_F`              | classification final linear params              | `W_F \in \mathbb{R}^{n \times k}`, `b_F \in \mathbb{R}^n` | classification Step 5                    |
| `W`                     | CBL-to-token weights in generation final layer  | `\mathbb{R}^{k \times                                     | \mathcal{V}                              | }`  | generation loss regularization |
| `\theta_1..\theta_5`    | model parameter groups                          | parameter tensors                                         | generation/classification equations      |
| `\ell`                  | sequence length                                 | scalar                                                    | generation token loss                    |
| `p_k`                   | concept-class probability from detector softmax | scalar                                                    | negative entropy loss                    |
| `\lambda, \alpha`       | regularization weights                          | scalars                                                   | classification and generation objectives |

## 5. Classification Pipeline

1. Start with labeled dataset `\mathcal{D}` having `n` classes.
2. Query ChatGPT once per class to generate concept subset `\mathcal{C}_i`; form `\mathcal{C}=\cup_i \mathcal{C}_i`.
3. Compute ACS pseudo concept labels for each sample: `S_c(x)_j=\mathcal{E}(c_j)\cdot\mathcal{E}(x)` using sentence embeddings.
4. Apply ACC: keep score only when score is positive and concept class matches sample label; otherwise set to zero.
5. Encode text with pretrained LM `f_{LM}(x)`.
6. Project LM features through CBL `f_{CBL}` and train LM+CBL to maximize similarity with `S_c^{ACC}(x)`.
7. Compute `A_N(x)` and apply `ReLU` to obtain `A_N^+(x)`.
8. Train sparse final linear classifier on `A_N^+(x)` with cross-entropy + elastic-net.
9. Predict classes via `W_F A_N^+(x)+b_F`.
10. Explain predictions by neuron contributions `W_{ij} A_N^+(x)_j`; intervene by deactivating neurons or removing selected final-layer weights.

## 6. Generation Pipeline

1. Prepare training data and concept labels `y_c` (paper experiments use dataset labels directly as concepts).
2. For each prefix, compute hidden representation via `f_{LLM}`.
3. Compute interpretable concept activations `f_{CBL}^+` and unsupervised activations `f_{unsup}`.
4. Concatenate both branches and map through `f_{FL}` to next-token logits.
5. Generate next token autoregressively and repeat for sequence length.
6. During training, simultaneously run adversarial module: `g_c(f_{unsup}(...))` with `\mathcal{L}_d` and `\mathcal{L}_e`.
7. During inference, optionally intervene on CBL activations (e.g., set target concept neuron high) to steer output.

## 7. Loss Functions

| equation name              | formula in LaTeX                                                                   | purpose                                                             | optimized parameters                                                                                                                                                            | task setting                                                                               |
| -------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| similarity objective       | `\max\_{\theta_1,\theta_2}\dfrac{1}{                                               | \mathcal{D}                                                         | }\sum*{x\in\mathcal{D}}\textsf{Sim}(f*\textrm{CBL}(f\_\textrm{LM}(x;\theta_1);\theta_2),S_c^{\textrm{ACC}}(x))`                                                                 | Align CBL neuron activations with corrected concept scores.                                | `\theta_1,\theta_2`                                                                                           | classification                |
| task loss (classification) | `\min\_{W_F,b_F}\dfrac{1}{                                                         | \mathcal{D}                                                         | }\sum*{x,y\in\mathcal{D}}\mathcal{L}*\textrm{CE}(W_FA_N^+(x)+b_F,y)+\lambda R(W_F)`                                                                                             | Predict class labels from interpretable concept activations with sparse weights.           | `W_F,b_F`                                                                                                     | classification                |
| concept loss               | `\mathcal{L}\_c=\dfrac{1}{                                                         | \mathcal{D}                                                         | }\sum*{x\in\mathcal{D}}\textrm{CE}(f^+*\textrm{CBL}(f\_\textrm{LLM}(x;\theta_1);\theta_2),y_c)`                                                                                 | Supervise CBL neurons to represent target concepts.                                        | `\theta_1,\theta_2`                                                                                           | generation                    |
| task/token loss            | `\mathcal{L}\_t=\dfrac{1}{                                                         | \mathcal{D}                                                         | \ell}\sum*{x\in\mathcal{D},i}\textrm{CE}(f*\textrm{FL}(f^+_\textrm{CBL}\Vert f_\textrm{unsup}(f*\textrm{LLM}([x_1,...,x*{i-1}];\theta_1);\theta_2\Vert\theta_3);\theta_4),y_i)` | Standard next-token prediction objective.                                                  | joint optimization stated for CBL/unsup/final-layer (`\theta_2,\theta_3,\theta_4`) with backbone (`\theta_1`) | generation                    |
| detection loss             | `\mathcal{L}\_d=\dfrac{1}{                                                         | \mathcal{D}                                                         | }\sum*{x\in\mathcal{D}}\textrm{CE}(g_c(f*\textrm{unsup}(f\_\textrm{LLM}(x));\theta_5),y_c)`                                                                                     | Train adversarial detector to recover concept labels from unsupervised features.           | `\theta_5`                                                                                                    | generation adversarial module |
| negative entropy loss      | `\mathcal{L}\_e=\dfrac{1}{                                                         | \mathcal{D}                                                         | }\sum*{x\in\mathcal{D}}\sum*{k=1}^{C} p*k\log p_k,\;\;p=\textrm{Softmax}(g_c(f*\textrm{unsup}(f\_\textrm{LLM}(x;\theta_1);\theta_3)))`                                          | Push unsupervised features toward concept-agnostic outputs (uniform detector predictions). | `\theta_1,\theta_3`                                                                                           | generation adversarial module |
| regularization             | `R(W)=\alpha \|W\|_1+(1-\alpha)\dfrac{1}{2}\|W\|_2^2`                              | Encourage sparse/stable concept-to-output connectivity.             | `W_F` (classification), `W` (generation)                                                                                                                                        | both                                                                                       |
| total loss                 | `\mathcal{L}=\mathcal{L}_c+\mathcal{L}_t+\mathcal{L}_e+\mathcal{L}_d+\lambda R(W)` | Jointly train main generation path and adversarial disentanglement. | joint training of generation modules (`\theta_1..\theta_5`, `W`)                                                                                                                | generation                                                                                 |

## 8. Concept Handling

### 8.1 How concepts are created

- Classification: concepts are generated by ChatGPT per class (`n` queries total), then unioned into one concept set.
- Prompt design uses four in-context examples and asks for additional features enclosed in `<example>...</example>`.
- Prompt targets per class from appendix prompts: SST2/YelpP ask for 100 additional concepts; AGnews 50; DBpedia 30.
- Generation: experiments directly use dataset class labels as concept labels (e.g., AGnews concepts are world/sports/business/technology).

### 8.2 How concepts are labeled/scored

- Classification ACS: score each concept for each sample by embedding dot product with `all-mpnet-base-v2`.
- Classification ACC: zero negative scores and zero concepts whose mapped class does not match sample label.
- Generation: uses dataset labels directly as concept supervision in reported experiments; paper states ACS could also be applied similarly.

### 8.3 How concepts map to neurons

- Classification: CBL has `k` neurons for `k` concepts; training maximizes similarity between CBL output and corrected concept score vector.
- Generation: CBL concept neurons are supervised with cross-entropy concept loss; final token logits are linear in concatenated `(concept neurons || unsupervised neurons)`.
- Interpretability linkage: linear weights from concept neurons to class/token logits expose contribution paths.

### 8.4 How interventions are applied

- Classification intervention: concept unlearning by deactivating a CBL neuron or removing corresponding final-layer weight connections.
- Generation intervention: manually set CBL activations at inference (paper steerability protocol uses target concept value `100`, others `0`).
- Toxicity chatbot setting: dedicated neurons represent benign/harmful query and benign/toxic response modes; user adjusts response neurons to steer outputs.

## 9. Experimental Setup

### Classification

- datasets: SST2, Yelp Polarity (YelpP), AGnews, DBpedia.
- backbones: `RoBERTa-base` and `GPT2` (appendix adds `Gemma2-2B`).
- concept counts if given: SST2 `208`; YelpP `248`; AGnews `216`; DBpedia `476`.
- baselines: TBM and C$^3$M implementation (`TBM&C$^3$M` with `Llama3-8B-Instruct` concept labeling on limited samples), fine-tuned black-box classifiers (RoBERTa/GPT2/Gemma2 by table context).
- metrics: test accuracy; labeling/training time cost; human evaluation Task 1 (Activation Faithfulness rating) and Task 2 (Contribution Faithfulness preference).
- dataset reductions if any: none for full CB-LLM training; TBM/C$^3$M labeling limited to `1,000` samples/dataset for feasibility.

### Generation

- datasets: SST2, YelpP, AGnews, DBpedia.
- backbones: `Llama3-8B` (appendix also `Llama2-13B`, `Mistral-7B`).
- concept counts if given: concepts are dataset labels; AGnews class count `4` and DBpedia class count `14` are stated; SST2/YelpP concept counts are `UNSPECIFIED IN PAPER` in the generation section.
- baselines: fine-tuned black-box Llama models; ablation without adversarial training (`CB-LLMs w/o ADV training`).
- metrics: concept detection accuracy; steerability score under intervention; generation perplexity of generated text evaluated by pretrained `Llama3-8B`; toxicity case reports detection accuracy and steerability.
- dataset reductions if any: YelpP, AGnews, and DBpedia reduced to `100k` samples each for generation experiments.

## 10. Main Results

- Classification with ACC reaches near-parity with black-box models and exceeds black-box on some datasets (RoBERTa setting: YelpP `0.9806` vs `0.9778`; DBpedia `0.9928` vs `0.9917`).
- Classification without ACC is consistently stronger than TBM&C$^3$M and within roughly `1%` to `5%` of black-box accuracy.
- ACS labeling is much faster than LLM labeling at scale (largest datasets around `1.6` hours with mpnet ACS vs `8+` hours for LLM labeling on only `1,000` samples).
- Human faithfulness Task 1 average rating: CB-LLM w/ ACC `4.12` vs TBM&C$^3$M `2.75`.
- Human faithfulness Task 2 preference: CB-LLM w/ ACC chosen better (`27.7%` clearly + `22.3%` slightly) vs TBM&C$^3$M better (`13.8%` slightly + `14.8%` clearly).
- Generation concept-detection accuracy is close to black-box fine-tuning (all datasets within ~`1%` absolute gap).
- Adversarial module substantially improves steerability over no-ADV ablation (e.g., AGnews `0.85` vs `0.52`, DBpedia `0.76` vs `0.21`).
- Toxicity chatbot case study reports toxicity detection accuracy `0.9996` and steerability `0.9137`.

## 11. Case Studies

- concept unlearning: Unlearning concept `"overpriced"` in Yelp changes `2,726` test predictions from negative to positive; `2,162/2,726` (`79%`) strongly entail `"overpriced"` by `bart-large-mnli`.
- concept unlearning: Appendix example unlearning `"Unappetizing food"` changes `370` predictions from negative to positive; `313/370` (`85%`) strongly entail the removed concept.
- toxicity reduction: Chatbot is fine-tuned on ToxicDPOqa + toxic-chat with four interpretable neurons (benign query, harmful query, benign response mode, toxic response mode).
- toxicity reduction: Model detects harmful query tokens and supports intervention-based response steering toward benign or toxic outputs.
- toxicity reduction: Reported metrics are detection accuracy `0.9996` and steerability `0.9137`.

## 12. Implementation-Relevant Notes

- Classification concept pipeline is explicitly staged: `concept generation -> ACS -> ACC -> CBL training -> sparse linear head training`.
- ACS uses sentence-embedding dot products (`all-mpnet-base-v2`) instead of per-sample LLM API calls.
- ACC rule depends on per-class concept partition and known class labels during training.
- ReLU is applied to CBL activations before final prediction in both classification and generation.
- Classification final predictor uses elastic-net (`\lambda=0.0007`, `\alpha=0.99`) to encourage sparse interpretable connections.
- Generation uses hybrid bottleneck (`CBL + unsup`) plus adversarial detector branch active only during training.
- Inference for generation discards adversarial detector branch and keeps the main generation path.
- Steering is performed by directly overriding concept neuron activations at generation time.

## 13. Reproduction Risks

- Core training hyperparameters (optimizer, learning rate, batch size, epochs, scheduler, seeds) are not provided.
- Generation architecture hyperparameters (unsupervised width `u`, exact CBL/unsup layer forms) are not specified.
- Some generation-equation notation is ambiguous, especially parameter placement in token-loss expression.
- Concept generation depends on ChatGPT outputs, which are non-deterministic and version-sensitive.
- Exact concept lists used in experiments are not fully enumerated in the main method text.
- Toxicity case setup lacks full dataset split and preprocessing details.
- Decoding settings for generation evaluation/intervention (temperature/top-p/top-k) are unspecified.
- Compute environment details (hardware, GPU counts, mixed precision, run budget) are unspecified.

## 14. Unspecified Details

- Exact venue/publication status beyond paper style formatting: `UNSPECIFIED IN PAPER`.
- Exact ChatGPT model/version, sampling settings, and date used for concept generation: `UNSPECIFIED IN PAPER`.
- Full preprocessing/tokenization/truncation settings for each dataset: `UNSPECIFIED IN PAPER`.
- Optimizer type, LR schedule, batch size, training epochs/steps, random seeds: `UNSPECIFIED IN PAPER`.
- Exact architectural form of CBL/unsup/final layers (e.g., number of layers, dropout, normalization): `UNSPECIFIED IN PAPER`.
- Unsupervised branch width `u`: `UNSPECIFIED IN PAPER`.
- Generation regularization coefficients (`\lambda`, `\alpha`) if different from classification: `UNSPECIFIED IN PAPER`.
- Exact formula definition for `Sim` (only “cos cubed” is named): `UNSPECIFIED IN PAPER`.
- Precise update schedule/alternation for adversarial objectives (`\mathcal{L}_e` vs `\mathcal{L}_d`): `UNSPECIFIED IN PAPER`.
- Number of generated samples per class for steerability evaluation: `UNSPECIFIED IN PAPER`.
- Decoding algorithm details for generated samples: `UNSPECIFIED IN PAPER`.
- Toxicity case training details (split sizes, concept-label construction for four neurons): `UNSPECIFIED IN PAPER`.

## 15. Pseudocode

```python
def train_cbllm_classification(D_train, class_labels):
    # Step 1: concept generation (n queries, one per class)
    C_i = {c: query_chatgpt_for_concepts(c) for c in class_labels}
    C = union_all(C_i.values())

    # Step 2: ACS pseudo concept labels
    # E = all-mpnet-base-v2
    S = {x: [dot(E(concept), E(x)) for concept in C] for x, _ in D_train}

    # Step 3: ACC correction
    M = concept_to_class_map(C_i)
    S_acc = {}
    for x, y in D_train:
        S_acc[x] = [s if (s > 0 and M[C[j]] == y) else 0 for j, s in enumerate(S[x])]

    # Step 4: train LM + CBL with similarity objective
    optimize_theta1_theta2_to_maximize_similarity(D_train, S_acc)

    # Step 5: train sparse linear layer on ReLU(CBL activations)
    A_plus = {x: relu(cbl(lm(x))) for x, _ in D_train}
    optimize_WF_bF_with_CE_plus_elastic_net(A_plus, D_train.labels, lam=0.0007, alpha=0.99)

    return trained_classification_cbllm
```

```python
def train_cbllm_generation(D_train):
    # Concepts in reported experiments are dataset labels; ACS alternative is mentioned.
    y_c = build_concept_labels_from_dataset_labels(D_train)

    for batch in iterate_batches(D_train):
        # Module 1: main CB-LLM training
        h = f_LLM(batch.prefixes)
        z_c = relu(f_CBL(h))
        z_u = f_unsup(h)
        token_logits = f_FL(concat(z_c, z_u))
        L_c = CE(z_c, y_c[batch])
        L_t = next_token_CE(token_logits, batch.next_tokens)

        # Module 2: adversarial disentanglement
        det_logits = g_c(z_u)
        p = softmax(det_logits)
        L_d = CE(det_logits, y_c[batch])               # optimize detector
        L_e = mean(sum_k(p_k * log(p_k)))              # optimize unsup to hide concept info

        # Joint loss
        L = L_c + L_t + L_e + L_d + lambda_ * elastic_net(W_cbl_to_vocab)
        optimize_jointly(L)  # exact optimizer/schedule UNSPECIFIED IN PAPER

    return trained_generation_cbllm
```

```python
def intervene_classification(model, x, interventions):
    # interventions: dict concept_index -> new_activation OR weight edit directive
    a = model.cbl(model.lm(x))
    a = relu(a)
    for j, v in interventions.get("set_activation", {}).items():
        a[j] = v
    logits = model.WF @ a + model.bF
    y_hat = argmax(logits)
    return y_hat, logits
```

```python
def intervene_generation(model, prompt_tokens, concept_activation_override):
    # concept_activation_override example from paper: target=100, others=0
    tokens = list(prompt_tokens)
    while not stop_condition(tokens):
        h = model.f_LLM(tokens)
        z_c = relu(model.f_CBL(h[-1]))
        z_u = model.f_unsup(h[-1])
        z_c = apply_override(z_c, concept_activation_override)
        logits = model.f_FL(concat(z_c, z_u))
        next_tok = decode(logits)  # decoding strategy UNSPECIFIED IN PAPER
        tokens.append(next_tok)
    return tokens
```
