#!/usr/bin/env node
// bcrypt-cli.js
// Usage:
//   ./bcrypt-cli.js               -> prompt password (masqué) et génère hash avec rounds=12
//   ./bcrypt-cli.js mypassword    -> génère hash pour "mypassword"
//   ./bcrypt-cli.js -r 14         -> prompt password, rounds=14
//   ./bcrypt-cli.js -r 10 "pwd"

const bcrypt = require('bcryptjs')
const readline = require('readline')
const { argv } = require('process')

function parseArgs(argv) {
    const args = { rounds: 10, password: null }
    for (let i = 2; i < argv.length; i++) {
        const a = argv[i]
        if (a === '-r' || a === '--rounds') {
            const v = argv[i+1]
            if (!v) continue
            args.rounds = parseInt(v, 10) || args.rounds
            i++
        } else if (!args.password) {
            args.password = a
        }
    }
    return args
}

async function promptHidden(promptText) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
        // disable output
        process.stdout.write(promptText)
        const onDataHandler = (char) => {
            char = char + ''
            switch (char) {
                case '\n':
                case '\r':
                case '\u0004':
                    process.stdin.removeListener('data', onDataHandler)
                    process.stdout.write('\n')
                    rl.close()
                    break
                default:
                    process.stdout.write('*')
                    break
            }
        }
        process.stdin.on('data', onDataHandler)
        rl.question('', (value) => {
            resolve(value)
        })
    })
}

;(async () => {
    const { rounds, password } = parseArgs(argv)
    let pwd = password
    if (!pwd) {
        pwd = await promptHidden('Password: ')
    }
    if (!pwd) {
        console.error('No password provided — abort.')
        process.exit(1)
    }
    const salt = bcrypt.genSaltSync(rounds)
    const hash = bcrypt.hashSync(pwd, salt)
    console.log(hash)
})()