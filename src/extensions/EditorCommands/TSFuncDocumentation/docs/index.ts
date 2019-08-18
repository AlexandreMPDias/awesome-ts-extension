import Extractor from './Extractor';
import Commentification from './Commentify';

const extractor = new Extractor();
class CommentGenerator
{
	commentify (selection: string, identation: number): string
	{
		const values = extractor.generate(selection);
		return new Commentification(values, identation).comment;
	}
}

export default new CommentGenerator();