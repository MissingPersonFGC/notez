import React, { useContext, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  makeStyles
} from "@material-ui/core";
import { Redirect } from "react-router-dom";
import {
  addCharacter,
  characterCreated,
  englishCharacter,
  japaneseCharacter,
  koreanCharacter,
  simplifiedCharacter,
  traditionalCharacter,
  cantoneseCharacter,
  clearForm
} from "../data/locales";
import localeSelect from "../services/localeSelect";
import { UserContext } from "../contexts/UserContext";
import { LanguageContext } from "../contexts/LanguageContext";
import { CharacterContext } from "../contexts/CharacterContext";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  header: {
    textAlign: "center"
  },
  buttonRow: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(2)
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative"
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  }
}));

export default function AddCharacter() {
  const classes = useStyles();
  const { user } = useContext(UserContext);
  const { language } = useContext(LanguageContext);
  const { loading, error, success, createCharacter } = useContext(
    CharacterContext
  );
  const [name, setName] = useState("");
  const [nameJa, setNameJa] = useState("");
  const [nameKo, setNameKo] = useState("");
  const [nameCn, setNameCn] = useState("");
  const [nameTw, setNameTw] = useState("");
  const [nameHk, setNameHk] = useState("");
  if (!user) {
    return <Redirect to="/" />;
  }
  return (
    <section className="add-character">
      <Typography className={classes.header} variant="h5">
        {localeSelect(language, addCharacter)}
      </Typography>
      <form
        onSubmit={e => {
          e.preventDefault();
          createCharacter(name, nameJa, nameKo, nameCn, nameTw, nameHk);
        }}
        disabled={loading}
      >
        <Container maxWidth="sm">
          {success && <p>{localeSelect(language, characterCreated)}</p>}
          {error && (
            <p className="error">
              <span>Error:</span> {error}
            </p>
          )}
          <TextField
            label={localeSelect(language, englishCharacter)}
            id="standard-name-required"
            value={name}
            onChange={e => {
              setName(e.target.value);
            }}
            fullWidth="true"
            placeholder="Character Name"
            required
          />
          <TextField
            label={localeSelect(language, japaneseCharacter)}
            value={nameJa}
            onChange={e => {
              setNameJa(e.target.value);
            }}
            fullWidth="true"
            placeholder="キャラクター名"
          />
          <TextField
            label={localeSelect(language, koreanCharacter)}
            value={nameKo}
            onChange={e => {
              setNameKo(e.target.value);
            }}
            fullWidth="true"
            placeholder="캐릭터 이름"
          />
          <TextField
            label={localeSelect(language, simplifiedCharacter)}
            value={nameCn}
            onChange={e => {
              setNameCn(e.target.value);
            }}
            fullWidth="true"
            placeholder="角色名字"
          />
          <TextField
            label={localeSelect(language, traditionalCharacter)}
            value={nameTw}
            onChange={e => {
              setNameTw(e.target.value);
            }}
            fullWidth="true"
            placeholder="角色名字"
          />
          <TextField
            label={localeSelect(language, cantoneseCharacter)}
            value={nameHk}
            onChange={e => {
              setNameHk(e.target.value);
            }}
            fullWidth="true"
            placeholder="角色名字"
          />
          <Container className={classes.buttonRow}>
            <div className={classes.wrapper}>
              <Button
                variant="contained"
                type="submit"
                color="primary"
                disabled={loading}
              >
                {localeSelect(language, addCharacter)}
              </Button>
              {loading && (
                <CircularProgress
                  size={20}
                  color="secondary"
                  className={classes.buttonProgress}
                />
              )}
            </div>
            <div className={classes.wrapper}>
              <Button
                onClick={() => {
                  setName("");
                  setNameJa("");
                  setNameKo("");
                  setNameCn("");
                  setNameTw("");
                  setNameHk("");
                }}
              >
                {localeSelect(language, clearForm)}
              </Button>
            </div>
          </Container>
        </Container>
      </form>
    </section>
  );
}
