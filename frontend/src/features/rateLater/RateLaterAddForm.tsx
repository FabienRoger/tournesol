import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, TextField, Button } from '@mui/material';
import Alert from 'src/components/Alert';
import { ApiError } from 'src/services/openapi/core/ApiError';
import { extractVideoId } from 'src/utils/video';

interface FormProps {
  addVideo: (id: string) => void;
}

const RateLaterAddForm = ({ addVideo }: FormProps) => {
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const [hasSucceeded, setHasSucceeded] = useState(false);
  const [formVideo, setFormVideo] = useState('');
  const { t } = useTranslation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setApiError(null);
    setHasSucceeded(false);
    try {
      await addVideo(extractVideoId(formVideo) || '');
      await setFormVideo('');
    } catch (err) {
      console.error('Add to rate later list failed.', `${err}\n`, err.body);
      setApiError(err);
      return;
    }
    setHasSucceeded(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Grid item>
          <TextField
            autoFocus
            required
            fullWidth
            placeholder={t('ratelater.videoIdOrURL')}
            onChange={(e) => setFormVideo(e.target.value)}
            value={formVideo}
            variant="standard"
          />
        </Grid>

        <Grid item>
          <Button
            type="submit"
            size="large"
            variant="contained"
            color="primary"
          >
            {t('ratelater.addToMyRateLaterList')}
          </Button>
        </Grid>
      </Grid>

      {hasSucceeded && <Alert>✅ {t('ratelater.videoAdded')}</Alert>}
      {apiError && apiError?.status === 409 && (
        <Alert>⚠️ {t('ratelater.videoAlreadyInList')}</Alert>
      )}
      {apiError && apiError?.status !== 409 && (
        <Alert>
          ❌ {t('errorOccurred')} {apiError.statusText}
        </Alert>
      )}
    </form>
  );
};

export default RateLaterAddForm;
