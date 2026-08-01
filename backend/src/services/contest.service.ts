import axios from "axios";
import { ContestRepository } from "../repositories/contest.repository.js";

export const LANGUAGE_IDS = {
  CPP: 54, JAVA: 62, PYTHON: 71, JAVASCRIPT: 63
};

export class ContestService {
  private contestRepo = new ContestRepository();

  async submitCode(studentId: string, challengeId: string, language: string, sourceCode: string) {
    const challenge = await this.contestRepo.getChallengeById(challengeId);
    if (!challenge) throw new Error("Challenge not found");

    const langId = LANGUAGE_IDS[language.toUpperCase() as keyof typeof LANGUAGE_IDS];
    if (!langId) throw new Error("Unsupported language");
    const options = {
      method: 'POST',
      url: `https://${process.env.JUDGE0_HOST}/submissions`,
      params: { base64_encoded: 'false', wait: 'true' },
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': process.env.JUDGE0_API_KEY!,
        'X-RapidAPI-Host': process.env.JUDGE0_HOST!
      },
      data: {
        language_id: langId,
        source_code: sourceCode,
        stdin: challenge.expectedInput,
        expected_output: challenge.expectedOutput,
        cpu_time_limit: 2.0,
        memory_limit: 128000
      }
    };

    const response = await axios.request(options);
    const result = response.data;
    const submission = await this.contestRepo.saveSubmission({
      studentId,
      challengeId,
      language: language.toUpperCase(),
      sourceCode,
      statusId: result.status.id, 
      timeExecuted: result.time ? parseFloat(result.time) : null,
      memoryUsed: result.memory || null
    });

    return { submission, judgeResult: result,contestId: challenge.contestId };
  }
}