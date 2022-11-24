package com.app.ps19.hosapp.safetyBriefing;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import androidx.fragment.app.Fragment;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.Toast;

import com.app.ps19.hosapp.R;
import com.app.ps19.hosapp.ScribbleNotesActivity;
import com.app.ps19.hosapp.Shared.Globals;
import com.app.ps19.hosapp.Shared.Utilities;
import com.app.ps19.hosapp.classes.IssueImage;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link CommentsFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link CommentsFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class CommentsFragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    public EditText etComments;
    public ImageView ivSignature;
    public IssueImage signatureObj= new IssueImage();;
    public ImageButton ibAddSignature;
    public Button ibSignatureRetake;
    public Button ibSignatureDelete;
    public Button btSaveComments;
    View rootView;


    private OnFragmentInteractionListener mListener;

    public CommentsFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment CommentsFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static CommentsFragment newInstance(String param1, String param2) {
        CommentsFragment fragment = new CommentsFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
        if(Globals.safetyBriefing.getSignature() == null){

            Globals.safetyBriefing.setSignature(new IssueImage());
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        rootView = inflater.inflate(R.layout.fragment_comments, container, false);
        etComments = rootView.findViewById(R.id.et_comments);
        ivSignature = rootView.findViewById(R.id.iv_comment_signature_display);
        ibAddSignature = rootView.findViewById(R.id.ib_comment_add_signature);
        ibSignatureRetake = rootView.findViewById(R.id.ib_comment_signature_retake);
        ibSignatureDelete = rootView.findViewById(R.id.ib_comment_signature_delete);
        btSaveComments = rootView.findViewById(R.id.bt_save_comments);
        // Currently not using save button
        btSaveComments.setVisibility(View.GONE);
        if(Globals.safetyBriefing.getReviewComments()!= null && !Globals.safetyBriefing.getReviewComments().equals("")){
            etComments.setText(Globals.safetyBriefing.getReviewComments());
        }

        if (Globals.safetyBriefing.getSignature() == null || Globals.safetyBriefing.getSignature().getImgName() == null) {
            /*if(Globals.safetyBriefing.getSignature().getImgName().equals("")){

            }*/
            ibSignatureDelete.setVisibility(View.GONE);
            ibSignatureRetake.setVisibility(View.GONE);
        } else {
            showImage(Globals.safetyBriefing.getSignature().getImgName());
            ibAddSignature.setVisibility(View.GONE);
        }

        ibAddSignature.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Globals.safetyBriefing.getSignature().setImgName("");
                Globals.imageFileName = "";
                // Toast.makeText(TravelBite.this, "test", Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(getActivity(), ScribbleNotesActivity.class);
                // Intent intent =new Intent(MainActivity.this,ScribbleNotesActivity.class);
                Bundle b=new Bundle();
                b.putString("filename","");
                //intent.putExtras(b);
                startActivityForResult(intent,1);
            }
        });
        ibSignatureRetake.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Globals.imageFileName = "";
                Intent intent = new Intent(getActivity(), ScribbleNotesActivity.class);
                Bundle b=new Bundle();
                b.putString("filename","");
                startActivityForResult(intent,1);
            }
        });

        ibSignatureDelete.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Globals.safetyBriefing.getSignature().setImgName("");
                Globals.safetyBriefing.setSignature(new IssueImage());
                ivSignature.setVisibility(View.GONE);
           /*     Drawable d = getResources().getDrawable(R.drawable.signature_placeholder);
                ivSignature.setImageDrawable(d);*/
                ibAddSignature.setVisibility(View.VISIBLE);
                ibSignatureDelete.setVisibility(View.GONE);
                ibSignatureRetake.setVisibility(View.GONE);
                Toast.makeText(getActivity(), "Signature removed!", Toast.LENGTH_SHORT).show();

            }
        });

        btSaveComments.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Toast.makeText(TravelBite.this, "test", Toast.LENGTH_SHORT).show();
            }
        });
        etComments.addTextChangedListener(new TextWatcher() {

            public void onTextChanged(CharSequence s, int start, int before,
                                      int count) {
                if (!s.equals("")) {
                    //do your work here
                    Globals.safetyBriefing.setReviewComments(s.toString());
                }
            }

            public void beforeTextChanged(CharSequence s, int start, int count,
                                          int after) {

            }

            public void afterTextChanged(Editable s) {

            }
        });

        return rootView;
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnFragmentInteractionListener) {
            mListener = (OnFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        void onFragmentInteraction(Uri uri);
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

        if (requestCode == 1) {
            if (resultCode == Activity.RESULT_OK) {
                String result = data.getStringExtra("result");
                if (result.equals("Taken")) {
                    ibAddSignature.setVisibility(View.GONE);
                    ibSignatureRetake.setVisibility(View.VISIBLE);
                    ibSignatureDelete.setVisibility(View.VISIBLE);
                    ivSignature.setVisibility(View.VISIBLE);
                    Globals.safetyBriefing.setSignature(new IssueImage(Globals.imageFileName,0, "worker"));
                    showImage(Globals.imageFileName);
                }
            }
        }
    }
    private void showImage(String imageFileName){
        if(!imageFileName.equals("")){
            Bitmap bitmap = Utilities.getImageFromSDCard(getActivity()
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
}
