import { join } from 'node:path';
import { cwd } from 'node:process';
import type { PromptAnswers } from '@idleberg/yeoman-generator';
import helpers from 'yeoman-test';

export function helper(buildArgs: PromptAnswers) {
	helpers.prepareTemporaryDir();

	return helpers.run(join(cwd(), '/generators/app')).withAnswers(buildArgs);
}
