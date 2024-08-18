import commandLineUsage from 'command-line-usage';
import {options} from './config.js';

export default function () {
    console.log(commandLineUsage([
        {
            header:  'Synopsis',
            content: '$ node . <options>',
        },
        {
            header:     'Options',
            optionList: options,
            tableOptions:    {
                padding: { left: '  ', right: ' ' },
                columns: [
                    { name: 'option', noWrap: true },
                    { name: 'description', width: 240 }
                ]
            }
        },
        {
            content: 'This app supports .env file syntax.',
        },
    ]));
}
