import React, { useContext, useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Button,
  Modal,
  TextField,
  makeStyles
} from "@material-ui/core";
import Select from "react-select";
import QuickAddNote from "./QuickAddNote";
import PopulateNotes from "./PopulateNotes";
import localeSelect from "../services/localeSelect";
import {
  gameNotes as gameNotesLocale,
  chooseGame,
  yourCharacter as yourCharacterLocale,
  opponentCharacter as opponentCharacterLocale,
  chooseFilter,
  clearFilter,
  notes,
  notice,
  noNotes,
  editingNote,
  filter as filterLocale,
  editNote as editNoteLocale,
  cancel
} from "../data/locales";
import dbLocale from "../services/dbLocale";
import { NoteContext } from "../contexts/NoteContext";
import { GameContext } from "../contexts/GameContext";
import { LanguageContext } from "../contexts/LanguageContext";
import sort from "../services/sort";

const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    width: "50%",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  button: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  spaced: {
    marginBottom: theme.spacing(2)
  }
}));

export default function GameNotes() {
  const classes = useStyles();
  const {
    gameNotes,
    loading,
    error,
    noteEditor,
    toggleNoteEditor,
    editNote
  } = useContext(NoteContext);
  const { games } = useContext(GameContext);
  const { language } = useContext(LanguageContext);
  const [game, setGame] = useState("");
  const [myCharacter, setMyCharacter] = useState("");
  const [opponentCharacter, setOpponentCharacter] = useState("");
  const [myFilter, setMyFilter] = useState("");
  const [displayedNotes, setDisplayedNotes] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [filters, setFilters] = useState([]);
  const [noteId, setNoteId] = useState("");
  const [editFilter, setEditFilter] = useState({});
  const [noteBody, setNoteBody] = useState("");

  // Effect called to grab characters and filters from chosen game, and set them to state.
  useEffect(() => {
    if (game !== "") {
      setMyCharacter("");
      setMyFilter("");
      setOpponentCharacter("");
      setDisplayedNotes([]);
      const index = games.findIndex(x => x._id === game);
      const { characters: allCharacters, filters: allFilters } = games[index];
      sort(allCharacters, language);
      sort(allFilters, language);
      setCharacters(allCharacters);
      setFilters(allFilters);
    }
  }, [game, games, language]);

  useEffect(() => {
    if (myCharacter !== "" && opponentCharacter !== "" && myFilter !== "") {
      const notes = [];
      gameNotes.forEach(note => {
        if (
          game === note.game &&
          myCharacter === note.myCharacter &&
          opponentCharacter === note.opponentCharacter &&
          myFilter === note.filter._id
        ) {
          notes.push(note);
        }
        if (
          game === note.game &&
          myCharacter === note.myCharacter &&
          note.universal === true &&
          myFilter === note.filter._id
        ) {
          notes.push(note);
        }
      });
      setDisplayedNotes(notes);
    } else if (
      myCharacter !== "" &&
      opponentCharacter !== "" &&
      myFilter === ""
    ) {
      const notes = [];
      gameNotes.forEach(note => {
        if (
          game === note.game &&
          myCharacter === note.myCharacter &&
          opponentCharacter === note.opponentCharacter
        ) {
          notes.push(note);
        }
        if (
          game === note.game &&
          myCharacter === note.myCharacter &&
          note.universal === true
        ) {
          notes.push(note);
        }
      });
      setDisplayedNotes(notes);
    }
  }, [myFilter, myCharacter, opponentCharacter, gameNotes, game]);

  return (
    <section className="game-notes">
      <Container>
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <Typography variant="h5" className={classes.spaced}>
              {localeSelect(language, gameNotesLocale)}
            </Typography>
            <Typography variant="h6">
              {localeSelect(language, chooseGame)}
            </Typography>
            <Select
              options={games.map(game => {
                return {
                  label: dbLocale(language, game),
                  value: game._id
                };
              })}
              onChange={e => {
                setGame(e.value);
              }}
              className={classes.spaced}
            />
            <Typography variant="h6">
              {localeSelect(language, yourCharacterLocale)}
            </Typography>
            <Select
              options={characters.map(character => {
                return {
                  label: dbLocale(language, character),
                  value: character._id
                };
              })}
              onChange={e => {
                setMyCharacter(e.value);
              }}
              className={classes.spaced}
            />
            <Typography variant="h6">
              {localeSelect(language, opponentCharacterLocale)}
            </Typography>
            <Select
              options={characters.map(character => {
                return {
                  label: dbLocale(language, character),
                  value: character._id
                };
              })}
              onChange={e => {
                setOpponentCharacter(e.value);
              }}
              className={classes.spaced}
            />
            <Typography variant="h6">
              {localeSelect(language, chooseFilter)}
            </Typography>
            <Select
              options={filters.map(x => {
                return {
                  label: dbLocale(language, x),
                  value: x._id
                };
              })}
              onChange={e => {
                setMyFilter(e.value);
              }}
              className={classes.spaced}
            />
            {myFilter !== "" && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setMyFilter("");
                }}
              >
                {localeSelect(language, clearFilter)}
              </Button>
            )}
          </Grid>
          <Grid item md={6} xs={12}>
            {game !== "" && myCharacter !== "" && opponentCharacter !== "" && (
              <Container>
                <Typography variant="h5" className={classes.spaced}>
                  {localeSelect(language, notes)}
                </Typography>
                <Grid container className={classes.spaced}>
                  {displayedNotes.length > 0 ? (
                    displayedNotes.map(note => {
                      return (
                        <PopulateNotes
                          key={note._id}
                          id={note._id}
                          note={note.note}
                          filter={dbLocale(language, note.filter)}
                          filterId={note.filter._id}
                          setEditFilter={setEditFilter}
                          setNoteBody={setNoteBody}
                          setNoteId={setNoteId}
                        />
                      );
                    })
                  ) : (
                    <PopulateNotes
                      filter={localeSelect(language, notice)}
                      note={localeSelect(language, noNotes)}
                    />
                  )}
                </Grid>
                <QuickAddNote
                  game={game}
                  myCharacter={myCharacter}
                  opponentCharacter={opponentCharacter}
                  filters={filters}
                  type="Game Note"
                />
              </Container>
            )}
          </Grid>
        </Grid>
      </Container>
      <Modal
        aria-labelledby="editor-title"
        open={noteEditor}
        onClose={() => {
          setNoteId("");
          setEditFilter({});
          setNoteBody("");
          toggleNoteEditor();
        }}
      >
        <Container className={classes.paper}>
          <Typography variant="h5" id="editor-title" className={classes.spaced}>
            {localeSelect(language, editingNote)}
          </Typography>
          {error && <Typography variant="body1">Error: ${error}</Typography>}
          <Typography variant="h6">
            {localeSelect(language, filterLocale)}
          </Typography>
          <Select
            options={filters.map(filter => {
              return {
                label: dbLocale(language, filter),
                value: filter._id
              };
            })}
            onChange={e => {
              setEditFilter({ label: e.label, value: e.value });
            }}
            defaultValue={editFilter}
            className={classes.spaced}
          />
          <TextField
            multiline
            name="note"
            value={noteBody}
            onChange={e => {
              setNoteBody(e.target.value);
            }}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              const result = editNote(
                "Game Note",
                noteId,
                editFilter.value,
                noteBody
              );
              if (result === true) {
                setNoteId("");
                setEditFilter({});
                setNoteBody("");
                toggleNoteEditor();
              }
            }}
          >
            {localeSelect(language, editNoteLocale)}
          </Button>
          <Button className={classes.button} onClick={toggleNoteEditor}>
            {localeSelect(language, cancel)}
          </Button>
        </Container>
      </Modal>
    </section>
  );
}
