const db = require('electron-db');
const path = require('path');
const fs = require('fs');

class Database {
    constructor(databaseDirectory) {
        this.pathToDatabases = path.join(path.join(path.join(path.join(__dirname, '../'), '../'), databaseDirectory), '');
        this.requiredTables = ['characters', 'items', 'spells'];

        this.certificateThatPathToDatabasesExists();
    }

    certificateThatPathToDatabasesExists() {
        if (!fs.existsSync(this.pathToDatabases)) {
            fs.mkdir(this.pathToDatabases, err => {
                if (err) {
                    throw err;
                }
            });
        }

        this.createRequiredTables();
    }

    tableExists(databaseName) {
        return db.valid(databaseName, this.pathToDatabases);
    }

    getNextRowId(tableName) {
        if (!this.tableExists(tableName)) {
            throw "Tabela não existe.";
        }

        let nextRowId = 0;

        this.fetchAllRowsFromTable(tableName, allRows => {
            nextRowId = allRows.length > 0 ? allRows[allRows.length - 1]["characterId"] + 1 : 1;
        })

        return nextRowId;
    }

    createRequiredTables() {
        this.requiredTables.forEach(tableName => {
            this.createTable(tableName);
        });
    }

    createTable(tableName) {
        const tableFileLocation = `${path.join(this.pathToDatabases, tableName)}.json`;

        if (!fs.existsSync(tableFileLocation)) {
            fs.appendFile(tableFileLocation, `{"${tableName}": []}`, err => {
                if (err) {
                    throw err;
                }
            });
        }

        return true;
    }

    insertIntoTable(tableName, object) {
        if (!this.tableExists(tableName)) {
            throw "Tabela não existe.";
        }

        db.insertTableContent(tableName, this.pathToDatabases, object, (succ, msg) => {
            if (!succ) {
                throw msg;
            }
        });

        return "Tabela alterada com sucesso.";
    }

    fetchAllRowsFromTable(tableName, callback) {
        if (!this.tableExists(tableName)) {
            throw "Tabela não existe.";
        }

        db.getAll(tableName, this.pathToDatabases, (succ, data) => {
            return callback(data);
        });
    }

    fetchRowsWithFilter(tableName, searchFilters = {}, callback) {
        if (!this.tableExists(tableName)) {
            throw "Tabela não existe.";
        }

        db.getRows(tableName, this.pathToDatabases, searchFilters, (succ, data) => {
            return callback(data);
        });
    }

    updateRowInTable(tableName, changeMap) {
        if (!this.tableExists(tableName)) {
            throw "Tabela não existe.";
        }

        db.updateRow(tableName, this.pathToDatabases, changeMap.where, changeMap.set, (succ, msg) => {
            if (!succ) {
                throw msg;
            }
        });

        return "Tabela atualizada com sucesso.";
    }

    deleteRowInTable(tableName, searchFilters) {
        if (!this.tableExists(tableName)) {
            throw "Tabela não existe.";
        }

        db.deleteRow(tableName, this.pathToDatabases, searchFilters, (succ, msg) => {
            if (!succ) {
                throw msg;
            }
        });

        return "Conteúdo excluído com sucesso";
    }
}

module.exports = Database;