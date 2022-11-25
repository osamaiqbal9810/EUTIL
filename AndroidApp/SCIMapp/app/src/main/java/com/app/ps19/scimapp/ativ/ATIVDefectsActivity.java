package com.app.ps19.scimapp.ativ;

import static com.app.ps19.scimapp.Shared.Globals.getSelectedUnit;
import static com.app.ps19.scimapp.Shared.Globals.selectedUnit;
import static com.app.ps19.scimapp.Shared.Utilities.dpToPixel;

import android.Manifest;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Build;
import android.os.Bundle;
import android.text.SpannableString;
import android.text.style.UnderlineSpan;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.res.ResourcesCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.app.ps19.scimapp.DefectCodeActivity;
import com.app.ps19.scimapp.R;
import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.classes.ativ.ATIVData;
import com.app.ps19.scimapp.classes.ativ.ATIVDefect;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

import java.util.ArrayList;

public class ATIVDefectsActivity extends AppCompatActivity implements OnMapReadyCallback, aDefectInterface  {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    private final int REQ_CODE_DEFECT_CODE = 11;
    // TODO: Rename and change types of parameters
    private String selectedUnitID;
    private String mParam2;
    Context _context;
    private ArrayList<ATIVDefect> ativDefectsList = new ArrayList<>();
    private GoogleMap mMap;
    private ScrollView svMainContainer;
    private ImageView ivTransparent;
    private ATIVDefect selectedDefect;
    private TextView tvLocName;
    private TextView tvIssueCount;
    private Marker prevMarker =null;
    ATIVData aData;
    private detailAdapter detailAdapter;
    ImageView ivMap;
    private String joString = "{'ativ_defects':[{'verified':false,'latitude':'0.0','longitude':'0.0','properties':[{'name':'Title','value':'Issue# 34','tag':'title'},{'name':'MilePost','value':'32.1','tag':'mp'},{'name':'Track Type','value':'MAIN','tag':'','index':1},{'name':'Worst Location','value':'4.88902'},{'name':'Defect Number','value':'94'},{'name':'Latitude','value':'41.7682','tag':'latitude'},{'name':'Longitude','value':'-87.8023','tag':'longitude'}]}]}";
    private aDefectAdapter defAdapter;
    private RecyclerView rvDefects;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ativdefects);
        selectedUnitID = getIntent().getStringExtra("EXTRA_UNIT_ID");

        tvLocName = findViewById(R.id.tv_loc_name);
        tvIssueCount = findViewById(R.id.tv_issue_count);
        ivMap = findViewById(R.id.iv_map);
        rvDefects = findViewById(R.id.rv_defects);

        aData = null;
        /*try {
            //aData = new ATIVData(new JSONObject(joString));
        } catch (JSONException e) {
            e.printStackTrace();
        }*/
        initializeMap();
        _context = this;
//        svMainContainer = rootView.findViewById(R.id.sv_main_container);
        ivTransparent = findViewById(R.id.transparent_image);

        tvLocName.setText(selectedUnit.getDescription());

        DisplayMetrics metrics = new DisplayMetrics();
        getWindowManager().getDefaultDisplay().getMetrics(metrics);
        int width = metrics.widthPixels;

        ativDefectsList = getSelectedUnit().getAtivDefects();

        selectedDefect = ativDefectsList.get(0);
        tvIssueCount.setText(String.valueOf(ativDefectsList.size()));
        rvDefects.setLayoutManager(new LinearLayoutManager(this));
        defAdapter = new aDefectAdapter(this, getSelectedUnit().getAtivDefects(),this);
        rvDefects.setAdapter(defAdapter);
        //defAdapter.setOnItemClickListener(this);

        ivMap.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent defMapActivity = new Intent(ATIVDefectsActivity.this,ATIVMapActivity.class);
                defMapActivity.putExtra("EXTRA_UNIT_ID", selectedUnitID);
                startActivity(defMapActivity);
            }
        });
        //evDefectsList.expandGroup(0);
    }
    private void initializeMap() {
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map_uca);
        mapFragment.getMapAsync(this);
    }
    public int GetDipsFromPixel(float pixels)
    {
        // Get the screen's density scale
        final float scale = getResources().getDisplayMetrics().density;
        // Convert the dps to pixels, based on density scale
        return (int) (pixels * scale + 0.5f);
    }
    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        if (ActivityCompat.checkSelfPermission(_context, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(_context, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        mMap.setMyLocationEnabled(false);
        mMap.getUiSettings().setMyLocationButtonEnabled(false);


        mMap.setInfoWindowAdapter(new GoogleMap.InfoWindowAdapter() {

            @Override
            public View getInfoWindow(Marker arg0) {
                return null;
            }

            @Override
            public View getInfoContents(Marker marker) {

                LinearLayout info = new LinearLayout(_context);
                info.setOrientation(LinearLayout.VERTICAL);

                TextView title = new TextView(_context);
                title.setTextColor(Color.BLACK);
                title.setGravity(Gravity.CENTER);
                title.setTypeface(null, Typeface.BOLD);
                title.setText(marker.getTitle());

                TextView snippet = new TextView(_context);
                snippet.setTextColor(Color.GRAY);
                snippet.setText(marker.getSnippet());

                info.addView(title);
                info.addView(snippet);

                return info;
            }
        });


        /*mCurrLocationMarker = mMap.addMarker(new MarkerOptions().position(new LatLng(mLocation.getLatitude(), mLocation.getLongitude())).title("Current Location")
                .icon(BitmapDescriptorFactory.fromBitmap(getMarkerBitmapFromView(R.drawable.ic_person_white_24dp))));*/

        //Location loc = selectedDefect.getLocation();
        LatLng asset = new LatLng(Double.parseDouble(selectedDefect.getoLatitude()), Double.parseDouble(selectedDefect.getoLongitude()));

        try {
            mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(asset, 50));

            prevMarker = googleMap.addMarker(new MarkerOptions()
                    .position(asset)
                    .title(selectedDefect.getTitle()).snippet(selectedDefect.getMilepost()));
            prevMarker.showInfoWindow();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
    private void onIssueClick(){

        if (mMap == null) return;

        mMap.clear();
        //Location loc = selectedDefect.getLocation();
        LatLng asset = new LatLng(Double.parseDouble(selectedDefect.getoLatitude()), Double.parseDouble(selectedDefect.getoLongitude()));

        try {

            prevMarker = mMap.addMarker(new MarkerOptions()
                    .position(asset)
                    .title(selectedDefect.getTitle()).snippet(selectedDefect.getMilepost()));
            prevMarker.showInfoWindow();

            mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(asset, 50));
        } catch (Exception e) {
            e.printStackTrace();
        }
        //Intent intent = new Intent(ATIVDefectsActivity.this, ATIVDefectDetailsActivity.class);
        //startActivity(intent);
    }
    private void showSelectionDialog(Marker marker){
        LayoutInflater factory = LayoutInflater.from(ATIVDefectsActivity.this);
        final View dialogView = factory.inflate(R.layout.dialog_ativ, null);
        final AlertDialog selectionDialog = new AlertDialog.Builder(ATIVDefectsActivity.this).create();
        RelativeLayout rlMainContainer = dialogView.findViewById(R.id.rl_dialog_container);
        // set up the RecyclerView
        RecyclerView rvDetails = findViewById(R.id.rv_details);
        rvDetails.setLayoutManager(new LinearLayoutManager(this));
        if(aData!=null){
            detailAdapter = new detailAdapter(this, aData.getDefects().get(0).getProperties());
            rvDetails.setAdapter(detailAdapter);
        }

        TextView tvDefSelectionCount = (TextView) findViewById(R.id.tv_defect_select_count);
        CheckBox cbVerify = dialogView.findViewById(R.id.cb_verify);
        CheckBox cbDeficiency = dialogView.findViewById(R.id.cb_deficiency);
        TextView tvDefectCodes = dialogView.findViewById(R.id.tv_defects);
        Button btnSave = dialogView.findViewById(R.id.btn_update);
        Button btnOpenForm = dialogView.findViewById(R.id.btn_update);

        SpannableString content = new SpannableString(getString(R.string.defects_title));
        content.setSpan(new UnderlineSpan(), 0, content.length(), 0);
        tvDefectCodes.setText(content);
        tvDefectCodes.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (!cbDeficiency.isChecked()) {
                    if (Globals.selectedUnit.getAssetTypeObj() != null) {
                        if (Globals.selectedUnit.getAssetTypeObj().getDefectCodes() != null) {
                            Intent intent = new Intent(ATIVDefectsActivity.this, DefectCodeActivity.class);
                            startActivityForResult(intent, REQ_CODE_DEFECT_CODE);
                            //startActivity(intent);
                        } else {
                            Toast.makeText(ATIVDefectsActivity.this, getString(R.string.no_def_code), Toast.LENGTH_SHORT).show();
                        }
                    } else {
                        Toast.makeText(ATIVDefectsActivity.this, getString(R.string.no_def_code), Toast.LENGTH_SHORT).show();
                    }
                } else {
                    Toast.makeText(ATIVDefectsActivity.this, getString(R.string.issue_type_msg), Toast.LENGTH_SHORT).show();
                }


            }
        });

        btnSave.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int defectCount = Integer.parseInt(tvDefSelectionCount.getText().toString());

                if (defectCount == 0 && !cbDeficiency.isChecked()) {
                    Toast.makeText(ATIVDefectsActivity.this, getResources().getString(R.string.issue_type_req_msg), Toast.LENGTH_SHORT).show();
                    return;
                }


            }
        });
        btnOpenForm.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //launchFormActivity(markerItemsMap.get(marker.getId()).getmTag(), sForm[0]);
                //selectionDialog.dismiss();
            }
        });

        selectionDialog.show();
    }
    public void setImage(final Context mContext, final ImageView imageView, int picture)
    {
        if (mContext != null && imageView != null)
        {
            try
            {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP)
                {
                    imageView.setImageDrawable(mContext.getResources().getDrawable(picture, mContext.getApplicationContext().getTheme()));
                } else
                {
                    imageView.setImageDrawable(mContext.getResources().getDrawable(picture));
                }
            } catch (Exception e)
            {
                e.printStackTrace();
            }
        }
    }
    private View getCustomTitle(String title){
        // Creating a new RelativeLayout
        RelativeLayout rlMain = new RelativeLayout(this);

        // Defining the RelativeLayout layout parameters.
        // In this case I want to fill its parent
        RelativeLayout.LayoutParams rlMainParam = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.MATCH_PARENT,
                (int) dpToPixel(ATIVDefectsActivity.this,45));

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            rlMain.setBackgroundColor(getColor(R.color.title_background));
        }
        ImageView ivTitle = new ImageView(this);
        RelativeLayout.LayoutParams rlIvParam = new RelativeLayout.LayoutParams(
                (int) dpToPixel(ATIVDefectsActivity.this,30),
                (int) dpToPixel(ATIVDefectsActivity.this,30));
        rlIvParam.addRule(RelativeLayout.CENTER_VERTICAL);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            rlIvParam.setMarginStart((int) dpToPixel(ATIVDefectsActivity.this, 30));
        }
        ivTitle.setColorFilter(ContextCompat.getColor(this, R.color.blackTextColor));
        setImage(this, ivTitle, R.drawable.ic_edit_location_gray_24dp);
        ivTitle.setLayoutParams(rlIvParam);


        TextView tvTitle = new TextView(this);
        RelativeLayout.LayoutParams rlTvParam = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.WRAP_CONTENT,
                RelativeLayout.LayoutParams.WRAP_CONTENT);
        rlTvParam.addRule(RelativeLayout.CENTER_VERTICAL);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            rlTvParam.setMarginStart((int) dpToPixel(ATIVDefectsActivity.this, 30));
        }
        Typeface typeface = ResourcesCompat.getFont(this, R.font.cabin);
        tvTitle.setTypeface(typeface);
        rlTvParam.addRule(RelativeLayout.RIGHT_OF,ivTitle.getId());
        tvTitle.setTextColor(Color.BLACK);
        tvTitle.setLayoutParams(rlTvParam);
        tvTitle.setText(title);

        rlMain.setLayoutParams(rlMainParam);
        rlMain.addView(ivTitle);
        rlMain.addView(tvTitle);
        return rlMain;
    }
    private View getDetailRow(String key, String value){
        // Creating a new LinearLayout
        LinearLayout llMain = new LinearLayout(this);

        // Defining the LinearLayout layout parameters.
        // In this case I want to fill its parent
        LinearLayout.LayoutParams llMainParam = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT,2);
        llMain.setOrientation(LinearLayout.HORIZONTAL);

        TextView tvKey = new TextView(this);
        LinearLayout.LayoutParams llTvParam = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT);
        llTvParam.weight = 1;

        Typeface typeface = ResourcesCompat.getFont(this, R.font.cabin);
        tvKey.setTypeface(typeface);
        tvKey.setText(key);

        TextView tvValue = new TextView(this);

        tvValue.setTypeface(typeface);
        tvValue.setText(value);

        tvKey.setTextColor(Color.BLACK);
        tvKey.setLayoutParams(llTvParam);

        llMain.setLayoutParams(llMainParam);
        llMain.addView(tvKey);
        llMain.addView(tvValue);
        return llMain;
    }

    @Override
    public void onResume(){
        super.onResume();
        if(defAdapter!=null){
            defAdapter = new aDefectAdapter(this, getSelectedUnit().getAtivDefects(), this);
            rvDefects.setAdapter(defAdapter);
        }
    }
    @Override
    public void onStop(){
        super.onStop();
        //setSelectedAtivDef(null);
    }

    @Override
    public void aDefectInterface(int position, int id) {
        selectedDefect = getSelectedUnit().getAtivDefects().get(position);
        onIssueClick();
    }
}