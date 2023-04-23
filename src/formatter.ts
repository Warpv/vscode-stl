'use strict';
import * as vscode from 'vscode';

export class STFormatterProvider implements vscode.DocumentFormattingEditProvider {
    private functions: Array<string> = [];
    private types: Array<string> = [];
    private bitligic: Array<string> = [];
    private convert: Array<string> = [];
    private wordlogic: Array<string> = [];
    private shift: Array<string> = [];
    private accumulator: Array<string> = [];
    private formats: Array<string> = [];
    private programcontroll: Array<string> = [];
    private jumps: Array<string> = [];
    private load: Array<string> = [];
    private transfer: Array<string> = [];
    private timers: Array<string> = [];
    private DataBlocks: Array<string> = [];
    private skipString: Array<string> = [];

    provideDocumentFormattingEdits(document: vscode.TextDocument) {
        if (vscode.window.visibleTextEditors.every((e) => e.document.fileName !== document.fileName)) {
            return [];
        }

        let out = [];
        this.functions = [
            'abs', 'acos', 'asin', 'atan', 'cos', 'sin', 'tan', 'exp', 'ln', 'sqrt',
        ];

        this.types = [
            'I', 'D', 'R'
        ];

        this.bitligic = [
            'a', 'an', 'o', 'on', 'x', 'xn', 'fn', 'fp', 'r', 's', 'not', 'set', 'clr', 'save',
        ];

        this.convert = [
            'bti', 'itb', 'btd', 'itd', 'dtb', 'dtr', 'invi', 'invd', 'negi', 'negd', 'negr',
            'caw', 'cad', 'rnd', 'trunc',
        ];

        this.wordlogic = [
            'aw', 'ad', 'ow', 'od', 'xow', 'xod',
        ];

        this.shift = [
            'ssi', 'ssd', 'slw', 'srw', 'sld', 'srd', 'rld', 'rrd', 'rlda', 'rrda',
        ];

        this.accumulator = [
            'tak', 'pop', 'push', 'ent', 'leave', 'dec', 'inc', 'bld', 'nop',
        ];

        this.formats = [
            'b', 'w', 'l', 's5time', 't', 'd', 'tod', 'c', 'p', 'symbol',
        ];

        this.programcontroll = [
            'call', 'fc', 'fb', 'db', 'cc', 'uc', 'be', 'bec', 'beu', 'mcr', 'mcra', 'mcrd',
        ];

        this.jumps = [
            'ju', 'jl', 'jc', 'jcn', 'jnb', 'jbi', 'jnbi', 'jo', 'jos', 'jz', 'jn', 'jp', 'jm',
            'jpz', 'jmz', 'juo', 'loop',
        ];

        this.load = [
            'l', 'l stw', 'lar', 'car',
        ];

        this.transfer = [
            't', 't stw', 'tar', '',
        ];

        this.timers = [
            'fr', 'lc', 'r', 'sd', 'ss', 'sp', 'sf', 'se', 'cd', 'cu',
        ];

        this.DataBlocks = [
            'opn', 'cdb', 'l dblg', 'l dbno', 'l dilg', 'l dino',
        ];

        // Do not format this strings
        this.skipString = [
            `["']{1}[^\"\'\\\\]*(?:\\\\[\\s\\S][^"'\\\\]*)*["']{1}`, // All strings in quotes
            '\\(\\*[\\s\\S]*?\\*\\)', // All comments in braces
            '\\/\\*[\\s\\S]*?\\*\\/', // All comments in slashes
            '\\/\\/[^\\n]*\\n' // All single line comments
        ];

        let text = document.getText();

        text = this.spaces(text);
        text = this.capitalize(text);

        out.push(
            new vscode.TextEdit(new vscode.Range(
                new vscode.Position(0, 0),
                document.lineAt(document.lineCount - 1).range.end), text
            )
        );

        return out;
    }

    spaces(text: string): string {
        // Delete space between func name and (
        // ABS ( to ABS(
        let regEx = new RegExp(`\\b(?:${this.functions.join('|')})\\b\\s+\\(`, "ig");
        text = text.replace(regEx, (match) => {
            return match.replace(/\s+/, '');
        });

        // Add space after keywords
        // IF( to IF (
        regEx = new RegExp(`\\b(IF|WHILE|CASE)\\(`, "ig");
        text = text.replace(regEx, (match, key) => {
            return key !== undefined ? key + ' (' : match;
        });

        // Add before after keywords
        // )THEN to ) THEN
        regEx = new RegExp(`\\)(THEN|DO|OF)\\b`, "ig");
        text = text.replace(regEx, (match, key) => {
            return key !== undefined ? ') ' + key : match;
        });

        let addSpace = {
            csb: ['\\*\\)', '\\*\\/', '(?<=.)\\/\\/', '(?<=.)\\(\\*', '(?<=.)\\/\\*'],
            csa: ['\\(\\*', '\\/\\*', '\\/\\/'],
            ss:  [':=', '<>', '>=', '<=', '=>', '\\+', '\\-', '\\/'],
            sb:  ['(?<!<|>|:)=', ':', '(?<!\\*)\\*(?!\\*)', '<', '(?<!=|<)>'],
            sa:  ['=(?!>| )', ':(?!=)', '\\*(?!\\*|;)', ',', '<(?!=|>)', '>(?!=)']
        };

        regEx = new RegExp(`(?<! |\\t)(${addSpace.csb.join('|')})`, "ig");
        text = text.replace(regEx, (match, sign) => " " + sign);
        regEx = new RegExp(`(${addSpace.csb.join('|')})(?! |\\t)`, "ig");
        text = text.replace(regEx, (match, sign) => sign + " ");

        regEx = new RegExp(`${this.skipString.join('|')}|(?<! |\\t)(${addSpace.ss.join('|')}|${addSpace.sb.join('|')})`, "ig");
        text = text.replace(regEx, (match, sign) => sign !== undefined ? " " + sign : match);
        regEx = new RegExp(`${this.skipString.join('|')}|(${addSpace.ss.join('|')}|${addSpace.sa.join('|')})(?! |\\t)`, "ig");
        text = text.replace(regEx, (match, sign) => sign !== undefined ? sign + " " : match);

        // Delete all spaces at the end of the lines
        text = text.split("\n").map(el => el.trimEnd()).join("\n");

        return text;
    }

    capitalize(text: string): string {
        let regEx = new RegExp(`(?<!\\\\(?:\\\\{2})*)${this.skipString.join('|')}
        |\\b(${this.types.join('|')}
        |${this.bitligic.join('|')}
        |${this.convert.join('|')}
        |${this.wordlogic.join('|')}
        |${this.shift.join('|')}
        |${this.accumulator.join('|')}
        |${this.formats.join('|')}
        |${this.programcontroll.join('|')}
        |${this.jumps.join('|')}
        |${this.load.join('|')}
        |${this.transfer.join('|')}
        |${this.timers.join('|')}
        |${this.DataBlocks.join('|')}
        |${this.functions.join('\\(|')}\\()\\b`, "ig");

        text = text.replace(regEx, (match, group) => {
            return group !== undefined ? match.toUpperCase() : match;
        });

        text = text.replace(/(?<=T|DT|TOD|D)#[0-9\\:\\-\\_yYmMdDhHsS]+/ig, (match, group) => {
            return group !== undefined ? match.toLowerCase() : match;
        });

        return text;
    }
}
