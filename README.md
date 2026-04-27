# TLT Interview Task

## How to use this Repo

### Setup

1. Clone this repo to your computer.
2. You will need `node.js` and `npm` installed to continue. You can easily [download them from the node.js website](https://nodejs.org/en/download).
3. Navigate to the `web-client` directory, and run `npm install`.
4. Rename the file called `.env.sample` to `.env`. It contains the setting required for offline mode. 
5. To start your local instance, run `npm run dev`. Unless you have updated your hosting, it should be available on `http://localhost:5173/`.

## About the Task

For an interview I was provided the following scenario:

You have been tasked with building a multiple-choice assessment tool that has this core functionality:
- [x] Present a student with a set of questions and their associated response options
- [x] Allow the student to select and submit their answer choice for each question
- [x] Validate response as correct/incorrect, and display feedback<sup>*</sup>
- [x] Move through all questions in the set<sup>*</sup>
- [ ] Complete the question set and display a calculated score (one point for each question)<sup>1</sup>

<sup>*</sup> I switched these two items so that a student would have the ability to navigate through the quiz with the ability to go back and review their answers before submission, and then upon submission they are able to navigate through their quiz to see how their answers measured up

<sup>1</sup> I still need to set aside time to include scoring

### How it went

 I was given just over a week to build the simple app defined above, but I chose to make my life harder by opting to work with a framework that I hadn't used since ~2018 (and then only as part of Laravel). I also spent more time and effort than I should have on bells and whistles (i.e. login via firebase auth, remote data fetching with firebase rtdb, and styling to match brand). Overall, I've definitely learned a lot about this kind of exercise, and how to handle it better in the future.

## How it's going

 This was definitely a hot mess at the time of the interview, but I have spent some time cleaning up my work and fixing pieces that I managed to break just before the interview. I have also added the ability to use the application in an 'offline mode' without the original firebase requirements.

### Remaining Goals

I still have a handful of things I would like to do with regards to this example moving forward.

- [ ] Add score calculation
- [ ] Add tests
- [ ] Set up testing infrastructure to prevent merges and deployments on failing tests
- [ ] Deploy the offline version to gh-pages
- [ ] Reformat the data to reflect the actual data structure I would prefer<sup>2</sup>
- [ ] Create a back-end to practice work with JWTs, etc.
- [ ] Eventually, I would like to build out a sample api to practice data manipulation (handling data, managing data, providing data, etc.)

<sup>2</sup> I hemmed and hawed over how I wanted the data until I realized I needed to start building and worry about it later. By the time I came up with the data structure I wanted, I didn't have enough time to actually model it with mock data and implement it. You can find a copy of updated mock data attached to [issue](../../issues/7).
