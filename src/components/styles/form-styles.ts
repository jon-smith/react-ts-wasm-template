import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

export function useFormStyles(extra?: { formControl?: CSSProperties }) {
	return makeStyles((theme: Theme) =>
		createStyles({
			formControl: {
				margin: theme.spacing(1),
				minWidth: 120,
				...extra?.formControl,
			},
		})
	)();
}
