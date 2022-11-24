package com.app.ps19.scimapp;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.classes.DUnit;

import java.util.ArrayList;
import java.util.Date;

import static com.app.ps19.scimapp.Shared.Globals.CURRENT_LOCATION;
import static java.lang.Math.PI;
import static java.lang.Math.atan2;
import static java.lang.Math.cos;
import static java.lang.Math.sin;
import static java.lang.StrictMath.abs;

public class uSelectionAdapter extends ArrayAdapter<DUnit> {
    private final Activity context;
    private ArrayList<DUnit> units;
    private String type;


    public uSelectionAdapter(Activity context, String type,  ArrayList<DUnit> _units) {
        super(context, R.layout.unit_selection_row, _units);
        // TODO Auto-generated constructor stub

        this.context = context;
        this.units = _units;
        this.type = type;
    }

    public View getView(final int position, View view, ViewGroup parent) {
        View rowView = view;
        if(rowView == null){
            LayoutInflater inflater = (LayoutInflater) parent.getContext().getSystemService(Context.LAYOUT_INFLATER_SERVICE);//context.getLayoutInflater();
            assert inflater != null;
            if(type.equals("static")){
                rowView = inflater.inflate(R.layout.unit_selection_fixed_row, null, true);
            } else {
                rowView = inflater.inflate(R.layout.unit_selection_row, null, true);
            }
        }
        if(type.equals("static")){
            ImageView titleImg = (ImageView) rowView.findViewById(R.id.iv_unit_title);
            TextView titleText = (TextView) rowView.findViewById(R.id.tv_asset_name);
            TextView descText = (TextView) rowView.findViewById(R.id.tv_asset_description);
        } else {

        }

        ImageView titleImg = (ImageView) rowView.findViewById(R.id.iv_unit_title);
        TextView titleText = (TextView) rowView.findViewById(R.id.tv_asset_name);
        TextView descText = (TextView) rowView.findViewById(R.id.tv_asset_description);
        TextView tvIssueCount = (TextView) rowView.findViewById(R.id.tv_asset_issue_count);

        TextView distanceText = (TextView) rowView.findViewById(R.id.tv_asset_distance);
        TextView distanceUnit = (TextView) rowView.findViewById(R.id.tv_asset_distance_unit);
        TextView directionText = (TextView) rowView.findViewById(R.id.tv_unit_direction_txt);
        ImageView ivDirection = (ImageView) rowView.findViewById(R.id.iv_unit_direction);
        ImageView ivProceed = (ImageView) rowView.findViewById(R.id.iv_proceed_asset_selection);
        /*LinearLayout llUnitTitle = (LinearLayout) rowView.findViewById(R.id.ll_unit_selection_title);
        ViewGroup.LayoutParams params = llUnitTitle.getLayoutParams();*/
// Changes the height and width to the specified *pixels*

        rowView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Globals.selectedReportType = units.get(position).getUnit().getAssetType();

                Globals.selectedUnit = units.get(position).getUnit();
                Globals.selectedDUnit = units.get(position);
                Intent returnIntent = new Intent();
                returnIntent.putExtra("result","selected");
                ((Activity)context).setResult(Activity.RESULT_OK,returnIntent);
                if(((Activity) context).getClass().getSimpleName().equals("UnitSelectionActivity")){
                    ((Activity)context).finish();
                } else {
                    //((Activity)context).recreate();
                    Intent intent = new Intent("asset-selection");
                    //            intent.putExtra("quantity",Integer.parseInt(quantity.getText().toString()));

                    intent.putExtra("isSelected", true);
                    LocalBroadcastManager.getInstance(context).sendBroadcast(intent);
                    //((Activity)context).finish();
                }
            }
        });
        if(type.equals("static")){
            /* LinearLayout.LayoutParams llParam = new LinearLayout.LayoutParams(
             *//*width*//* Utilities.getDp(context, 259),
             *//*height*//* ViewGroup.LayoutParams.WRAP_CONTENT, 3.0f
            );
            llUnitTitle.setLayoutParams(llParam);*/
            titleImg.setImageResource(R.drawable.unit_static);
            titleText.setText(units.get(position).getUnit().getDescription());
            descText.setText(units.get(position).getUnit().getAssetType());
            tvIssueCount.setText(units.get(position).getUnit().getIssueCounter());
                /*LinearLayout.LayoutParams param = new LinearLayout.LayoutParams(
                        Utilities.getDp(context, 24),
                        Utilities.getDp(context, 30),
                        1.5f
                );
                ivProceed.setLayoutParams(param);
                ivProceed.setVisibility(View.VISIBLE);*/
        } else if(type.equals("sorted")){
            /*LinearLayout.LayoutParams llParam = new LinearLayout.LayoutParams(
             *//*width*//* ViewGroup.LayoutParams.WRAP_CONTENT,
             *//*height*//* ViewGroup.LayoutParams.WRAP_CONTENT, 3.0f
            );
            llUnitTitle.setLayoutParams(llParam);*/
            //ivProceed.setVisibility(View.GONE);
            titleImg.setImageResource(R.drawable.unit_sort);
            tvIssueCount.setText(units.get(position).getUnit().getIssueCounter());
            if(units.get(position).getDistance() > 1000){
                Double kmValue = units.get(position).getDistance()/1000;
                kmValue = Math.round(kmValue * 100.0) / 100.0;
                distanceUnit.setText("km");
                //strDistance = " [ " + kmValue + "km ]";
                distanceText.setText(kmValue.toString());
            } else {
                distanceUnit.setText("m");
                distanceText.setText(Double.toString(units.get(position).getDistance()));
                //strDistance = " [ " + units.get(position).getDistance() + "m ]";
            }
            titleText.setText(units.get(position).getUnit().getDescription());


            titleText.setText(units.get(position).getUnit().getDescription());
            descText.setText(units.get(position).getUnit().getAssetType());
            String[] _curLocation = CURRENT_LOCATION.split(",");
            String latitude="0.0";
            String longitude="0.0";
            if(units.get(position).getUnit().getCoordinates().size()>0){
                latitude= String.valueOf(units.get(position).getUnit().getCoordinates().get(0).getLatLng().latitude);
                longitude= String.valueOf(units.get(position).getUnit().getCoordinates().get(0).getLatLng().longitude);
            }
            directionText.setText(getDirection(
                    Double.valueOf(_curLocation[0]),
                    Double.valueOf(_curLocation[1]),
                    Double.valueOf(latitude),
                    Double.valueOf(longitude)

//                    Double.valueOf(units.get(position).getUnit().getCoordinates().get(0).getLatLng().latitude),
//                    Double.valueOf(units.get(position).getUnit().getCoordinates().get(0).getLatLng().longitude)

            ));
            String _angle = getAngle(
                    Double.valueOf(_curLocation[0]),
                    Double.valueOf(_curLocation[1]),
                    Double.valueOf(latitude),
                    Double.valueOf(longitude)

                    //Double.valueOf(units.get(position).getUnit().getCoordinates().get(0).getLatLng().latitude),
                    //Double.valueOf(units.get(position).getUnit().getCoordinates().get(0).getLatLng().longitude)

            );
            /*directionText.setText(getDirection(
                    Double.valueOf(_curLocation[0]),
                    Double.valueOf(_curLocation[1]),
                    Double.valueOf(units.get(position).getUnit().getCoordinates().get(0).getLat()),
                    Double.valueOf(units.get(position).getUnit().getCoordinates().get(0).getLon())));
            String _angle = getAngle(
                    Double.valueOf(_curLocation[0]),
                    Double.valueOf(_curLocation[1]),
                    Double.valueOf(units.get(position).getUnit().getCoordinates().get(0).getLat()),
                    Double.valueOf(units.get(position).getUnit().getCoordinates().get(0).getLon()));*/
            String[] angle= _angle.split(".");
            ivDirection.setImageResource(R.drawable.unit_direction);
            if(angle.length == 0){
                ivDirection.setRotation(Float.valueOf(_angle));
            } else ivDirection.setRotation(Float.valueOf(angle[0]));
            //distanceText.setText("Distance: " + strDistance);
        } //if (type.equals("sorted")){
        //String strDistance = "--";




           /* distanceText.setText(bearing(
                    Double.valueOf(_curLocation[0]),
                    Double.valueOf(_curLocation[1]),
                    Double.valueOf(units.get(position).getUnit().getCoordinates().get(0).getLat()),
                    Double.valueOf(units.get(position).getUnit().getCoordinates().get(0).getLon())));*/

        // }
        return rowView;
    };
    /**
     *  Returns a string that describes the number of days
     *  between dateOne and dateTwo.
     *
     */

    public long getDateDiffString(Date dateOne, Date dateTwo)
    {
        long timeOne = dateOne.getTime();
        long timeTwo = dateTwo.getTime();
        long oneDay = 1000 * 60 * 60 * 24;
        long delta = (timeTwo - timeOne) / oneDay;

        if (delta > 0) {
            return delta;
        }
        else {
            delta *= -1;
            return delta;
        }
    }
    private String getAngle(double latitude1, double longitude1, double latitude2, double longitude2){
        /*double longitude1 = lon1;
        double longitude2 = lon2;
        double latitude1 = Math.toRadians(lat1);
        double latitude2 = Math.toRadians(lat2);
        double longDiff= Math.toRadians(longitude2-longitude1);
        double y= Math.sin(longDiff)*Math.cos(latitude2);
        double x=Math.cos(latitude1)*Math.sin(latitude2)-Math.sin(latitude1)*Math.cos(latitude2)*Math.cos(longDiff);
        double resultDegree= (Math.toDegrees(Math.atan2(y, x))+360)%360;
        String coordNames[] = {"N","NNE", "NE","ENE","E", "ESE","SE","SSE", "S","SSW", "SW","WSW", "W","WNW", "NW","NNW", "N"};
        double directionid = Math.round(resultDegree / 22.5);
        // no of array contain 360/16=22.5
        if (directionid < 0) {
            directionid = directionid + 16;
            //no. of contains in array
        }
        String compasLoc=coordNames[(int) directionid];*/
        double lat1 = toRadians(latitude1);
        double lat2 = toRadians(latitude2);
        double lng1 = toRadians(longitude1);
        double lng2 = toRadians(longitude2);
        double Y = sin(lng2 - lng1) * cos(lat2);
        double X = cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(lng2 - lng1);
        double deg = toDegrees(atan2(Y, X));
        // note that this implementation doesn't use the module, but angles lower than 0 get augmented by 360 only
        if (deg < 0) {
            deg = 360 + deg;
        }
        double angle = deg;
        int a = (int) (abs(angle) + (1 / 7200));
        return Integer.toString(a);
    }
    protected static String getDirection(double lat1, double lon1, double lat2, double lon2){
        double longitude1 = lon1;
        double longitude2 = lon2;
        double latitude1 = Math.toRadians(lat1);
        double latitude2 = Math.toRadians(lat2);
        double longDiff= Math.toRadians(longitude2-longitude1);
        double y= sin(longDiff)*cos(latitude2);
        double x=cos(latitude1)*sin(latitude2)-sin(latitude1)*cos(latitude2)*cos(longDiff);
        double resultDegree= (Math.toDegrees(atan2(y, x))+360)%360;
        String coordNames[] = {"N","NNE", "NE","ENE","E", "ESE","SE","SSE", "S","SSW", "SW","WSW", "W","WNW", "NW","NNW", "N"};
        double directionid = Math.round(resultDegree / 22.5);
        // no of array contain 360/16=22.5
        if (directionid < 0) {
            directionid = directionid + 16;
            //no. of contains in array
        }
        String compasLoc=coordNames[(int) directionid];

        return compasLoc;
    }
    double toRadians(double angle) {
        return (PI / 180) * angle;
    }

    double toDegrees(double rad) {
        return (rad * 180) / PI;
    }

}
