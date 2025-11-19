# Pitch discrimination experiment

Running the experiment locally

```sh
npm start
```

### Research question
How does JND for pitch differ between human voice stimuli and instrumental tones

### Motivation
There are different factors that may affect how pitch discrimination can differ between voice and instrumental stimuli. First, humans are exposed to vocal sounds even before birth, which may possibly lead to specific perceptual expertise. Second, the voice contains unique acoustic characteristics (like natural vibrato) that could interfere with pitch perception compared to the “purer” tones of many instruments. 

- **Evolutionary perspective:** Humans may have evolved specialized auditory processing for voice signals given their survival importance (identifying speakers, detecting emotional states, understanding speech prosody). This could manifest as enhanced pitch sensitivity for vocal stimuli.
- **Acoustic complexity:** Voices have complex harmonic structures, formants, and temporal variations. How does this complexity affect our basic pitch perception abilities?


### Related questions/Factors

- Does musical training affect the JND while listening to human voice or instrument?
- Does the person’s preference in instrumental music affect his JND in this case?
- Does a person who speaks a tonal language have a different JND for human voice?
- Do self considered good singers have better pitch sensitivity (lower JND values) than self considered bad singers?


## Experiment

For the experiment, we will use recorded voice and piano stimuli, manipulating pitch slowly using a formant preserving pitch manipulation algorithm. We have tested for audible artifacts at various pitch shift levels and found no audible artifacts at small pitch shifts required for our JND measurements. We plan to recruit participants from diverse backgrounds to examine whether pitch discrimination abilities vary across different populations. The participants will also complete an anonymous questionnaire, where they will share information about their background, native language, musical training and other information.

This is where we measure how good you are at detecting tiny differences in pitch. Here's how it works:
What you'll do: You'll hear three sounds in a row. Two of them are exactly the same pitch, and one is slightly different (higher or lower). Your job is to identify which one is the odd one out!

How the test adapts to you:
- When you get it right several times, it makes the pitch difference smaller (harder)
- When you get it wrong, it makes the pitch difference bigger (easier)

Eventually, it zeros in on the smallest pitch difference you can reliably detect
You'll do this once with a piano sound and with a human singing voice
 

### Resources

- Pfordresher, P. Q., & Demorest, S. M. (2020). The Prevalence and Correlates of Accurate Singing. Journal of Research in Music Education, 69(1), 5-23. https://doi.org/10.1177/0022429420951630 (Original work published 2021)
- Halpern, A. R., & Pfordresher, P. Q. (2022). What do less accurate singers remember? Pitch-matching ability and long-term memory for music. Attention, Perception, & Psychophysics, 84(1), 260–269. https://doi.org/10.3758/s13414-021-02391-1
- Pitch discrimination is better for synthetic timbre than natural musical instrument timbres despite familiarity https://pmc.ncbi.nlm.nih.gov/articles/PMC9800047/
