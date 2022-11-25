package com.app.ps19.elecapp.safetyBriefing;

import static com.app.ps19.elecapp.Shared.Globals.setLocale;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.os.Build;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.animation.TranslateAnimation;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.Switch;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.app.ps19.elecapp.R;
import com.app.ps19.elecapp.ScribbleNotesActivity;
import com.app.ps19.elecapp.Shared.Globals;
import com.app.ps19.elecapp.Shared.Utilities;
import com.app.ps19.elecapp.classes.IssueImage;
import com.app.ps19.elecapp.classes.Worker;

import java.util.ArrayList;

public class WorkerAddActivity extends AppCompatActivity {

    EditText etAcct;
    EditText etName;
    IssueImage signatureImg = new IssueImage();
    ImageView ivSignature;
    Button ibRetake;
    Button ibRemove;
    Button btnSave;
    ImageButton ibAddSignature;
    Switch swByPhone;
    Worker worker = new Worker();
    RelativeLayout rlSignature;
    String uid;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setLocale(this);
        setTitle(R.string.activity_title_worker_add);
        setContentView(R.layout.activity_worker_add);
        etAcct = findViewById(R.id.et_worker_acct);
        etName = findViewById(R.id.et_worker_name);
        ivSignature = findViewById(R.id.iv_worker_signature);
        ibAddSignature = findViewById(R.id.ib_worker_add_signature);
        ibRetake = findViewById(R.id.ib_worker_signature_retake);
        ibRemove = findViewById(R.id.ib_worker_signature_delete);
        btnSave = findViewById(R.id.btn_worker_save);
        swByPhone = findViewById(R.id.sw_worker_byPhone);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        rlSignature = findViewById(R.id.rl_add_signature);
        if (Globals.safetyBriefing.getWorkers() == null) {
            Globals.safetyBriefing.setWorkers(new ArrayList<Worker>());
        }
        //Currently not using this SAVE button
        btnSave.setVisibility(View.GONE);

        if(Globals.selectedWorker!=null){
            etName.setText(Globals.selectedWorker.getName());
            etAcct.setText(Globals.selectedWorker.getAcctNumber());
            if(Globals.selectedWorker.isByPhone()){
                ibAddSignature.setVisibility(View.GONE);
                ivSignature.setVisibility(View.GONE);
                ibRetake.setVisibility(View.GONE);
                ibRemove.setVisibility(View.GONE);
            } else {
                if(Globals.selectedWorker.getSignature() != null){
                    showImage(Globals.selectedWorker.getSignature().getImgName());
                }
            }
            swByPhone.setChecked(Globals.selectedWorker.isByPhone());
            uid = Globals.selectedWorker.getUid();
            signatureImg = Globals.selectedWorker.getSignature();
        } else {
            ibRemove.setVisibility(View.GONE);
            ibRetake.setVisibility(View.GONE);
            ibAddSignature.setVisibility(View.VISIBLE);
        }

        btnSave.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (etAcct.getText().toString().equals("")) {
                    Toast.makeText(WorkerAddActivity.this, getString(R.string.toast_add_acct), Toast.LENGTH_SHORT).show();
                    etAcct.requestFocus();
                } else if (etName.getText().toString().equals("")) {
                    Toast.makeText(WorkerAddActivity.this, getString(R.string.toast_worker_name), Toast.LENGTH_SHORT).show();
                    etName.requestFocus();
                } else if (!swByPhone.isChecked() && signatureImg.getImgName().equals("")) {
                    Toast.makeText(WorkerAddActivity.this, getString(R.string.toast_worker_signature), Toast.LENGTH_SHORT).show();
                    ibAddSignature.requestFocus();
                } else {
                    worker.setAcctNumber(etAcct.getText().toString());
                    worker.setName(etName.getText().toString());
                    worker.setSignature(signatureImg);
                    worker.setByPhone(swByPhone.isChecked());
                    worker.setUid(Utilities.getUniqueId());
                    Globals.safetyBriefing.getWorkers().add(worker);
                    Intent returnIntent = new Intent();
                    returnIntent.putExtra("result", "added");
                    setResult(RESULT_OK, returnIntent);
                    finish();
                }
            }
        });
        if(signatureImg != null){
            if (signatureImg.getImgName() == null || signatureImg.getImgName().equals("")) {

            } else {
                ibAddSignature.setVisibility(View.GONE);
            }
        } else {
            ibRemove.setVisibility(View.GONE);
            ibRetake.setVisibility(View.GONE);
        }

        ibAddSignature.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                signatureImg = new IssueImage();
                Globals.imageFileName = "";
                Intent intent = new Intent(WorkerAddActivity.this, ScribbleNotesActivity.class);
                // Intent intent =new Intent(MainActivity.this,ScribbleNotesActivity.class);
                Bundle b=new Bundle();
                b.putString("filename","");
                //intent.putExtras(b);
                startActivityForResult(intent,1);
            }
        });
        ibRetake.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Globals.imageFileName = "";
                // Toast.makeText(TravelBite.this, "test", Toast.LENGTH_SHORT).show();
                //signatureImg.setImgName("");
                Intent intent = new Intent(WorkerAddActivity.this, ScribbleNotesActivity.class);
                // Intent intent =new Intent(MainActivity.this,ScribbleNotesActivity.class);
                Bundle b=new Bundle();
                b.putString("filename","");
                //intent.putExtras(b);
                startActivityForResult(intent,1);
            }
        });

        ibRemove.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                signatureImg = new IssueImage();
                Globals.imageFileName = "";
               /* Drawable d = getResources().getDrawable(R.drawable.signature_placeholder);
                ivSignature.setImageDrawable(d);*/
                ivSignature.setVisibility(View.GONE);
                ibAddSignature.setVisibility(View.VISIBLE);
                ibRemove.setVisibility(View.GONE);
                ibRetake.setVisibility(View.GONE);
                Toast.makeText(WorkerAddActivity.this,  getString(R.string.toast_signature_removed), Toast.LENGTH_SHORT).show();
            }
        });
        swByPhone.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                // do something, the isChecked will be
                // true if the switch is in the On position
                if(isChecked){
                    /*rlSignature.animate()
                            .translationY(0)
                            .alpha(0.0f)
                            .setListener(new AnimatorListenerAdapter() {
                                @Override
                                public void onAnimationEnd(Animator animation) {
                                    super.onAnimationEnd(animation);
                                    ivSignature.setVisibility(View.GONE);
                                    ibRetake.setVisibility(View.GONE);
                                    ibRemove.setVisibility(View.GONE);
                                }
                            });*/
                    ibAddSignature.setVisibility(View.GONE);
                    ivSignature.setVisibility(View.GONE);
                    ibRetake.setVisibility(View.GONE);
                    ibRemove.setVisibility(View.GONE);
                } else {
                    ibAddSignature.setVisibility(View.VISIBLE);
                    ivSignature.setVisibility(View.VISIBLE);
                    ibRetake.setVisibility(View.VISIBLE);
                    ibRemove.setVisibility(View.VISIBLE);
                    if(signatureImg == null){
                        signatureImg = new IssueImage();
                    }
                    if (signatureImg.getImgName() == null || signatureImg.getImgName().equals("")) {
                        ibRemove.setVisibility(View.GONE);
                        ibRetake.setVisibility(View.GONE);
                    } else {
                        ibAddSignature.setVisibility(View.GONE);
                    }
                    //rlSignature.setVisibility(View.VISIBLE);
                }
            }
        });
    }
    private void showImage(String imageFileName){
        if(!imageFileName.equals("")){
            Bitmap bitmap = Utilities.getImageFromSDCard(getApplicationContext()
                    ,imageFileName);
            if (bitmap != null) {
                BitmapDrawable background = new BitmapDrawable(bitmap);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
                    ivSignature.setImageDrawable(background );
                }else
                {
                    ivSignature.setImageDrawable(background);
                }
            }
        }
    }
    // slide the view from its current position to below itself
    public void slideDown(View view){
        TranslateAnimation animate = new TranslateAnimation(
                0,                 // fromXDelta
                0,                 // toXDelta
                0,                 // fromYDelta
                view.getHeight()); // toYDelta
        animate.setDuration(500);
        animate.setFillAfter(true);
        view.startAnimation(animate);
    }
    public void slideUp(View view){
        view.setVisibility(View.VISIBLE);
        TranslateAnimation animate = new TranslateAnimation(
                0,                 // fromXDelta
                0,                 // toXDelta
                view.getHeight(),  // fromYDelta
                0);                // toYDelta
        animate.setDuration(500);
        animate.setFillAfter(true);
        view.startAnimation(animate);
    }
    @Override
    public boolean onSupportNavigateUp() {
        //code it to launch an intent to the activity you want
        //if (!etAcct.getText().toString().equals("") || !etName.getText().toString().equals("") || !signatureImg.getImgName().equals("")) {
            showDialog();
        //} else {
        //    finish();
        //}
        return true;
    }
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        switch(keyCode){
            case KeyEvent.KEYCODE_BACK:
                showDialog();
                return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

        if (requestCode == 1) {
            if (resultCode == Activity.RESULT_OK) {
                String result = data.getStringExtra("result");
                if (result.equals("Taken")) {
                    ibAddSignature.setVisibility(View.GONE);
                    ivSignature.setVisibility(View.VISIBLE);
                    ibRetake.setVisibility(View.VISIBLE);
                    ibRemove.setVisibility(View.VISIBLE);
                    showImage(Globals.imageFileName);
                    signatureImg.setImgName(Globals.imageFileName);
                    Globals.imageFileName = "";
                }
            }
        }
    }

    void showDialog() {
        AlertDialog alertDialog = new AlertDialog.Builder(this)
//set icon
                .setIcon(android.R.drawable.ic_dialog_alert)
//set title
                .setTitle(getString(R.string.title_warning))
//set message
                .setMessage(getString(R.string.message_save_changes))
//set positive button
                .setPositiveButton(getString(R.string.briefing_yes), new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        Boolean isDuplicate = false;
                        //set what would happen when positive button is clicked
                        if (etAcct.getText().toString().equals("")) {
                            Toast.makeText(WorkerAddActivity.this, getString(R.string.toast_add_acct), Toast.LENGTH_SHORT).show();
                            etAcct.requestFocus();
                        } else if (etName.getText().toString().equals("")) {
                            Toast.makeText(WorkerAddActivity.this, getString(R.string.toast_worker_name), Toast.LENGTH_SHORT).show();
                            etName.requestFocus();
                        } else if (!swByPhone.isChecked() && signatureImg.getImgName() == null){//.getImgName().equals("")) {
                            Toast.makeText(WorkerAddActivity.this, getString(R.string.toast_worker_signature), Toast.LENGTH_SHORT).show();
                            ibAddSignature.requestFocus();
                        } else {
                            if(Globals.safetyBriefing.getWorkers().size()>0){
                                if(Globals.selectedWorker == null){
                                    Globals.selectedWorker = new Worker();
                                }
                                for (int j = 0; j < Globals.safetyBriefing.getWorkers().size(); j++) {
                                    if(!etAcct.getText().toString().equals(Globals.selectedWorker.getAcctNumber()) && etAcct.getText().toString().equals(Globals.safetyBriefing.getWorkers().get(j).getAcctNumber())){
                                        Toast.makeText(WorkerAddActivity.this, getString(R.string.toast_worker_acct) + etAcct.getText().toString() + getString(R.string.toast_already_exist), Toast.LENGTH_SHORT).show();
                                        isDuplicate = true;
                                    }
                                    //System.out.println(list.get(i));
                                }
                                if(Globals.selectedWorker.getUid() == null){
                                    Globals.selectedWorker = null;
                                }
                            }
                            if(!isDuplicate){
                                worker.setAcctNumber(etAcct.getText().toString());
                                worker.setName(etName.getText().toString());
                                worker.setSignature(signatureImg);
                                worker.setByPhone(swByPhone.isChecked());
                                if(swByPhone.isChecked()){
                                    worker.setSignature(new IssueImage());
                                }
                                if(Globals.selectedWorker == null){
                                    worker.setUid(Utilities.getUniqueId());
                                    Globals.safetyBriefing.getWorkers().add(worker);
                                } else {
                                    worker.setUid(Globals.selectedWorker.getUid());
                                    Worker oldWorker=Globals.safetyBriefing.getWorkers().get(Globals.safetyBriefing.getWorkers().indexOf(Globals.selectedWorker));
                                    worker.setHmBackupValues(oldWorker.getHmBackupValues());
                                    Globals.safetyBriefing.getWorkers().set(Globals.safetyBriefing.getWorkers().indexOf(Globals.selectedWorker), worker);
                                }

                                Intent returnIntent = new Intent();
                                returnIntent.putExtra("result", "added");
                                setResult(RESULT_OK, returnIntent);
                                Globals.selectedWorker = null;
                                finish();
                            }
                        }
                    }
                })
//set negative button
                .setNegativeButton("No", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        //set what should happen when negative button is clicked
                        Intent returnIntent = new Intent();
                        returnIntent.putExtra("result", "not-added");
                        setResult(RESULT_OK, returnIntent);
                        Globals.selectedWorker = null;
                        finish();

                    }
                })
                .setNeutralButton(getString(R.string.text_cancel), new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        //set what should happen when neutral button is clicked


                    }
                })
                .show();
    }
}
